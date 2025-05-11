import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { MailModule } from './mail/mail.module';
import { EquipmentModule } from './equipment/equipment.module';
import { TrainerModule } from './trainer/trainer.module';
import { ManagerModule } from './manager/manager.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    RoleModule,
    MailModule,
    EquipmentModule,
    TrainerModule,
    ManagerModule,
  ],
})
export class AppModule {}
