import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { RtStrategy } from './strategies/rt.strategy';
import { AtStrategy } from './strategies/at.strategy';
import { RstStrategy } from './strategies/rst.strategy';
import { VtStrategy } from './strategies/vt.strategy';
import { AccountModule } from '../account/account.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [JwtModule.register({}), AccountModule, RoleModule],
  controllers: [AuthController],
  providers: [AuthService, RtStrategy, AtStrategy, RstStrategy, VtStrategy],
})
export class AuthModule {}
