import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: configService.get('MAILER_SERVICE'),
          auth: {
            user: configService.get('MAILER_USER'),
            pass: configService.get('MAILER_PASSWORD'),
          },
        },
        defaults: {
          from: `"${configService.get('MAILER_FROM_NAME')}" <${configService.get('MAILER_USER')}>`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
