import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { RequestModule } from './modules/request/request.module';

@Module({
  imports: [AuthModule, WorkflowModule, RequestModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
