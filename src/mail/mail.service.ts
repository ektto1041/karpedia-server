import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendAdmin(subject: string, template: string) {
    this.mailerService.sendMail({
      to: 'dhkdwk1041@gmail.com',
      subject: `[Karpedia] ${subject}`,
      template: `./${template}`,
      // context: { p1: 'p1', ... }
    })
  }
}