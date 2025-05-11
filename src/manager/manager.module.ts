import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { RoleModule } from '@/role/role.module';
import { AuthModule } from '@/auth/auth.module';
import { MailModule } from '@/mail/mail.module';

@Module({
  imports: [PrismaModule, RoleModule, AuthModule, MailModule],
  controllers: [ManagerController],
  providers: [ManagerService],
  exports: [ManagerService],
})
export class ManagerModule {}
