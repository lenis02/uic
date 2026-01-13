import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { HistoryModule } from './history/history.module';
import { MembersModule } from './members/members.module';
import { ResearchModule } from './research/research.module';
import { GreetingModule } from './greeting/greeting.module';

@Module({
  imports: [
    // 1. SQLite 연결 설정
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite', // 프로젝트 루트에 생성됨
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 개발 중에는 true (엔티티 수정 시 DB 자동 반영)
    }),
    // 2. 구현한 각 기능 모듈 등록
    AuthModule,
    HistoryModule,
    MembersModule,
    ResearchModule,
    GreetingModule,
  ],
})
export class AppModule {}
