import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { HistoryModule } from './history/history.module';
import { MembersModule } from './members/members.module';
import { ResearchModule } from './research/research.module';
import { GreetingModule } from './greeting/greeting.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ContactModule } from './contact/contact.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 👇 메일 설정 변경
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          // ✅ 465 대신 587 사용 (가장 안정적)
          port: 587,
          // ✅ 587 포트는 false여야 함 (STARTTLS 사용)
          secure: false,
          auth: {
            user: config.get<string>('EMAIL_USER'),
            pass: config.get<string>('EMAIL_PASS'),
          },
        },
        defaults: {
          from: `"UIC Website" <${config.get<string>('EMAIL_USER')}>`,
        },
      }),
    }),

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
