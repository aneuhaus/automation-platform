import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'
import { Prisma } from '../../generated/prisma/client.js'
import { CreateWorkflowInput } from '@automation-platform/contracts'

@Injectable()
export class WorkflowService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, data: CreateWorkflowInput) {
    return this.prisma.workflow.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        definition: data.definition as Prisma.InputJsonValue,
        organizationId,
      },
    })
  }

  async findAll(organizationId: string) {
    return this.prisma.workflow.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: string, organizationId: string) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id },
    })

    if (!workflow || workflow.organizationId !== organizationId) {
      throw new NotFoundException(`Workflow with ID ${id} not found`)
    }

    return workflow
  }
}
