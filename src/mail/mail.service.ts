import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { Subscriber } from "src/users/dto/subscriber.dto";

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
    this.mailerService.sendMail({
      to: 'dhkdwk1041@gmail.com',
      subject: `[Karpedia] 새 댓글이 작성되었습니다.`,
      template: `./new-comment.ejs`,
      context: { title: postTitle }
    })
  }

  async sendToSubscribers(subscribers: Subscriber[], topicsName: string, topicsId: number) {
    subscribers.forEach(s => {
      this.mailerService.sendMail({
        to: s.email,
        subject: `[Karpedia] ${topicsName} 토픽에 새로운 포스트가 작성되었습니다.`,
        template: `./new-post.ejs`,
        context: { name: topicsName, id: topicsId },
      })
    });
  }
}