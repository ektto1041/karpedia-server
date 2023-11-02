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

  async newCommentsAlarm(postTitle: string) {
    console.log(postTitle);

    this.mailerService.sendMail({
      to: 'dhkdwk1041@gmail.com',
      subject: `[Karpedia] 새 댓글이 작성되었습니다.`,
      template: `./new-comment.ejs`,
      context: { title: postTitle }
    })
  }
}