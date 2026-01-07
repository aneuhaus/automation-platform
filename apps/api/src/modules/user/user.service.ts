import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'
import { Prisma } from '../../generated/prisma/client.js'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }

  async createUser(data: Prisma.UserCreateInput) {
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(data.passwordHash, salt)

    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName ?? null,
        lastName: data.lastName ?? null,
      },
    })
  }
}
