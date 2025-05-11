import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [PrismaModule, RoleModule],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
