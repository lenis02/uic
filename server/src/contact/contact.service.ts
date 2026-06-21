// src/contact/contact.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  async sendEmail(contactDto: ContactDto): Promise<void> {
    const name = this.escapeHtml(contactDto.name);
    const email = this.escapeHtml(contactDto.email);
    const message = this.escapeHtml(contactDto.message);

    // 발송 결과를 기다려, 실패 시 호출자에게 에러를 전파한다.
    try {
      await this.mailerService.sendMail({
        to: 'koreauic@gmail.com',
        from: process.env.EMAIL_USER,
        replyTo: email,
        subject: `[웹사이트 문의] ${name}님의 메시지`,
        html: `<p>보낸사람: ${name} (${email})</p><p>${message}</p>`,
      });
    } catch (e) {
      console.error(`❌ [Fail] Email error:`, e);
      throw new InternalServerErrorException(
        '문의 전송에 실패했습니다. 잠시 후 다시 시도해주세요.',
      );
    }
  }
}
