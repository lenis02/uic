import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { HistoryModule } from './history/history.module';
import { MembersModule } from './members/members.module';
import { ResearchModule } from './research/research.module';
import { GreetingModule } from './greeting/greeting.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ContactModule } from './contact/contact.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PopupModule } from './popup/popup.module';
import { NetworkModule } from './network/network.module';
import { PartnerModule } from './partner/partner.module';
import { ActivityModule } from './activity/activity.module';
import { JoinusModule } from './joinus/joinus.module';
import { AdvertisementModule } from './advertisement/advertisement.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),

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
    NetworkModule,
    PartnerModule,
    ActivityModule,
    JoinusModule,
    AdvertisementModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
