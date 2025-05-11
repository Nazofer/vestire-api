import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { RoleModule } from '@/role/role.module';
import { AuthModule } from '@/auth/auth.module';
import { MailModule } from '@/mail/mail.module';

@Module({
  imports: [PrismaModule, RoleModule, AuthModule, MailModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
