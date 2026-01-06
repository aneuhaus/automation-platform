import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateWorkflowInputSchema } from '@automation-platform/contracts';
import { User } from '../../generated/prisma/client';

@Controller('workflows')
@UseGuards(JwtAuthGuard)
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() body: unknown) {
    if (!user.organizationId) {
      throw new UnauthorizedException('User does not belong to an organization');
    }
    const input = CreateWorkflowInputSchema.parse(body);
    return this.workflowService.create(user.organizationId, input);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    if (!user.organizationId) {
      return [];
    }
    return this.workflowService.findAll(user.organizationId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    if (!user.organizationId) {
      throw new UnauthorizedException('User does not belong to an organization');
    }
    return this.workflowService.findOne(id, user.organizationId);
  }
}
