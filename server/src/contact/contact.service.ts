// src/contact/contact.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly mailerService: MailerService) {}

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  // async는 있어도 되지만, 절대 await를 쓰면 안 됩니다.
  async sendEmail(contactDto: ContactDto): Promise<void> {
    const name = this.escapeHtml(contactDto.name);
    const email = this.escapeHtml(contactDto.email);
    const message = this.escapeHtml(contactDto.message);

    // 👇 await 없이 실행! (백그라운드 작업 시작)
    this.mailerService
      .sendMail({
        to: 'koreauic@gmail.com',
        from: process.env.EMAIL_USER,
        replyTo: email,
        subject: `[웹사이트 문의] ${name}님의 메시지`,
        html: `<p>보낸사람: ${name} (${email})</p><p>${message}</p>`,
      })
      .then(() => {
        console.log(`✅ [Success] Email sent`);
      })
      .catch((e) => {
        console.error(`❌ [Fail] Email error:`, e);
      });

    // 함수는 여기서 즉시 끝납니다.
  }
}
