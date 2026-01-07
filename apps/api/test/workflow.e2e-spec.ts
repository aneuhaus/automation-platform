import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from './../src/app.module'
import { PrismaService } from './../src/common/prisma.service'

describe('WorkflowController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwtToken: string
  let organizationId: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    prisma = app.get(PrismaService)
    await app.init()

    // Clean DB
    await prisma.request.deleteMany()
    await prisma.workflow.deleteMany()
    await prisma.user.deleteMany()
    await prisma.organization.deleteMany()

    // Setup: Create Organization
    const org = await prisma.organization.create({
      data: { name: 'Test Org' },
    })
    organizationId = org.id

    // Setup: Create User linked to Organization
    await prisma.user.create({
      data: {
        email: 'test-workflow@example.com',
        passwordHash:
          '$2b$10$EpI.j.q.Z.F.w.r.t.y.u.i.o.p.a.s.d.f.g.h.j.k.l.z.x.c.v.b.n.m', // Mock hash
        firstName: 'Workflow',
        lastName: 'Tester',
        organizationId: org.id,
      },
    })

    // Login to get Token (using the AuthService logic implicitly via login endpoint or logic)
    // Since we manually created the user with a mock hash, logging in via API might fail if we don't know the plain text.
    // Better to Register via API to get a valid user + password logic.

    // Redo Setup: Use API for User creation to ensure auth works
    await prisma.user.deleteMany({
      where: { email: 'test-workflow@example.com' },
    })

    // Register
    await request(app.getHttpServer()).post('/auth/register').send({
      email: 'test-workflow@example.com',
      password: 'password123',
      firstName: 'Workflow',
      lastName: 'Tester',
    })

    // Manually link user to org (hack because register doesn't support orgId yet or we didn't implement it)
    await prisma.user.update({
      where: { email: 'test-workflow@example.com' },
      data: { organizationId: org.id },
    })

    // Login
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test-workflow@example.com',
        password: 'password123',
      })

    jwtToken = loginRes.body.access_token
  })

  afterAll(async () => {
    await prisma.$disconnect()
    await app.close()
  })

  it('/workflows (POST) - should create a workflow', () => {
    return request(app.getHttpServer())
      .post('/workflows')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        name: 'My New Workflow',
        description: 'Testing creation',
        definition: { nodes: [], edges: [] },
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined()
        expect(res.body.name).toEqual('My New Workflow')
        expect(res.body.organizationId).toEqual(organizationId)
      })
  })

  it('/workflows (GET) - should list workflows', () => {
    return request(app.getHttpServer())
      .get('/workflows')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.length).toBeGreaterThan(0)
        expect(res.body[0].name).toEqual('My New Workflow')
      })
  })
})
