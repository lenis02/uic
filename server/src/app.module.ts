import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { HistoryModule } from './history/history.module';
import { MembersModule } from './members/members.module';
import { ResearchModule } from './research/research.module';
import { GreetingModule } from './greeting/greeting.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config'; // ConfigService 추가
import { ContactModule } from './contact/contact.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    // 1. 환변 변수 설정 (가장 먼저 실행됨)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. 메일 설정 (비동기로 변경!)
    // .env가 다 로드된 뒤에 ConfigService를 통해 값을 확실히 가져옵니다.
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',

          // 👇 [핵심 변경] 587 대신 465 사용 (보안 수준 높음, 차단 잘 안 됨)
          port: 465,

          // 👇 [필수] 465 포트는 반드시 true여야 합니다.
          secure: true,

          auth: {
            user: config.get<string>('EMAIL_USER'),
            pass: config.get<string>('EMAIL_PASS'),
          },

          // 👇 [추가] 터미널에 로그를 찍어서 멈춘 건지 진행 중인지 확인
          logger: true,
          debug: true,
        },
        defaults: {
          from: `"UIC Website" <${config.get<string>('EMAIL_USER')}>`,
        },
      }),
    }),

    // 3. DB 설정
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    AuthModule,
    HistoryModule,
    MembersModule,
    ResearchModule,
    GreetingModule,
    ContactModule,
    CloudinaryModule,
  ],
  providers: [CloudinaryService],
})
export class AppModule {}
