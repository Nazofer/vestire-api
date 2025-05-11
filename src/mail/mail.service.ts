import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

export interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  context?: Record<string, any>;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendMail(options: MailOptions): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: options.to,
        subject: options.subject,
        text: options.text,
      });
      return true;
    } catch (error) {
      this.logger.error(
        `Помилка відправки листа: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
