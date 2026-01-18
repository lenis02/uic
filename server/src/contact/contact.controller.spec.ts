// src/modules/contact/contact.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('contact')
export class ContactController {
  constructor(private readonly mailerService: MailerService) {}

  @Post()
  async sendEmail(
    @Body() data: { name: string; email: string; message: string },
  ) {
    await this.mailerService.sendMail({
      to: process.env.EMAIL_USER, // 받는 사람 (동아리 공식 계정 등)
      from: data.email, // 보내는 사람 (실제 발송은 인증된 계정으로 되지만 헤더에 표시됨)
      subject: `[UIC 문의] ${data.name}님의 문의사항입니다.`,
      text: `
        보낸 사람: ${data.name} (${data.email})
        
        [문의 내용]
        ${data.message}
      `,
    });
    return { success: true };
  }
}
