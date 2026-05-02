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
import { PopupModule } from './popup/popup.module';

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
          // 💡 [핵심] host, port, secure 다 필요 없습니다. 이거 한 줄이면 끝납니다.
          service: 'gmail',
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
      synchronize: false,
      logging: process.env.NODE_ENV !== 'production',
      ssl:
        process.env.DB_SSL === 'true'
          ? {
              rejectUnauthorized:
                process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
            }
          : false,
    }),

    AuthModule,
    HistoryModule,
    MembersModule,
    ResearchModule,
    GreetingModule,
    ContactModule,
    CloudinaryModule,
    PopupModule,
  ],
  providers: [CloudinaryService],
})
export class AppModule {}
