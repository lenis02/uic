import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { MailerService } from '@nestjs-modules/mailer';
import { InternalServerErrorException } from '@nestjs/common';
import { ContactDto } from './dto/contact.dto';

// 1. 가짜 MailerService 정의
// 실제로 메일을 보내지 않고 "보내는 척"만 하는 함수(jest.fn)를 만듭니다.
const mockMailerService = {
  sendMail: jest.fn().mockResolvedValue('Email Sent'), // 성공했다고 가정
};

describe('ContactService', () => {
  let service: ContactService;
  let mailerService: typeof mockMailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        // 2. 진짜 MailerService 대신 가짜를 사용하도록 설정
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
    mailerService = module.get(MailerService);

    // 각 테스트 실행 전 Mock 기록 초기화
    jest.clearAllMocks();
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    // 테스트용 데이터
    const dto: ContactDto = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Hello, this is a test message.',
    };

    it('메일 발송이 성공하면 에러 없이 완료되어야 한다', async () => {
      // 실행
      await service.sendEmail(dto);

      // 검증: sendMail 함수가 호출되었는지?
      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);

      // 검증: 호출될 때 인자(옵션)가 올바르게 들어갔는지?
      expect(mailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'koreauic@gmail.com', // 받는 사람 확인
          replyTo: dto.email, // 답장 받을 이메일이 DTO와 같은지 확인
          subject: expect.stringContaining(dto.name), // 제목에 이름이 들어갔는지
          html: expect.stringContaining(dto.message), // 내용에 메시지가 들어갔는지
        }),
      );
    });

    it('메일 발송 중 에러가 발생하면 InternalServerErrorException을 던져야 한다', async () => {
      // 강제로 에러 발생시키기 (메일 서버 다운 상황 가정)
      mailerService.sendMail.mockRejectedValue(new Error('SMTP Error'));

      // 실행 및 검증: 에러가 발생하는지 확인
      await expect(service.sendEmail(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
