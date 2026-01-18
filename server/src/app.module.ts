import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { HistoryModule } from './history/history.module';
import { MembersModule } from './members/members.module';
import { ResearchModule } from './research/research.module';
import { GreetingModule } from './greeting/greeting.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역 모듈로 설정 (어디서든 process.env 사용 가능)
    }),

    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER, // .env 파일에 정의된 내 구글 이메일
          pass: process.env.EMAIL_PASS, // .env 파일에 정의된 앱 비밀번호
        },
      },
    }),

    // 1. SQLite 연결 설정
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // .env에서 주소 가져옴
      autoLoadEntities: true, // 엔티티 자동 로드 (매우 편리함)
      synchronize: true, // 개발 중에는 true (엔티티 수정 시 DB 자동 반영)
      ssl: {
        rejectUnauthorized: false, // 클라우드 DB 연결 시 SSL 필수 설정
      },
    }),

    // 2. 구현한 각 기능 모듈 등록
    AuthModule,
    HistoryModule,
    MembersModule,
    ResearchModule,
    GreetingModule,
    ContactModule,
  ],
})
export class AppModule {}
