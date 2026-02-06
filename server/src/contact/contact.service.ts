import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer'; // [중요] 라이브러리 교체
import { ContactDto } from './dto/contact.dto'; // DTO 파일 경로 확인

@Injectable()
export class ContactService {
  // AppModule에서 설정한 MailerService를 가져옵니다.
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(contactDto: ContactDto): Promise<void> {
    console.log('User:', process.env.EMAIL_USER);
    console.log('Pass exists:', !!process.env.EMAIL_PASS); // true가 나와야 함

    const { name, email, message } = contactDto;

    try {
      await this.mailerService.sendMail({
        to: 'koreauic@gmail.com', // 받는 사람 (관리자)
        from: process.env.EMAIL_USER, // 보내는 사람 (설정된 앱 계정)
        replyTo: email, // [중요] 답장하기 누르면 문의한 사람 이메일로 감
        subject: `[웹사이트 문의] ${name}님의 메시지`,
        html: `
          <div style="border: 1px solid #ddd; padding: 20px; font-family: Arial, sans-serif;">
            <h2>새로운 문의가 도착했습니다.</h2>
            <p><strong>보낸 사람:</strong> ${name}</p>
            <p><strong>보낸 이메일:</strong> ${email}</p>
            <hr />
            <h3>문의 내용:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        `,
      });

      console.log(
        `Email sent successfully to koreauic@gmail.com from ${email}`,
      );
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new InternalServerErrorException('메일 전송에 실패했습니다.');
    }
  }
}
