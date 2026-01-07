import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import * as bcrypt from 'bcrypt'
import { z } from 'zod'
import { User } from '../../generated/prisma/client'

export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const RegisterDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

type LoginInput = z.infer<typeof LoginDto>
type RegisterInput = z.infer<typeof RegisterDto>

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.userService.findOne(email)
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash: _passwordHash, ...result } = user
      return result
    }
    return null
  }

  async login(input: LoginInput) {
    const user = await this.validateUser(input.email, input.password)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }
    const payload = { sub: user.id, email: user.email }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async register(input: RegisterInput) {
    const user = await this.userService.createUser({
      email: input.email,
      passwordHash: input.password, // UserService handles hashing
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
    })
    const { passwordHash: _passwordHash, ...result } = user
    return result
  }
}
