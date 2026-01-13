import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 추가
import { Greeting } from './entities/greeting.entity'; // 추가
import { GreetingService } from './greeting.service';
import { GreetingController } from './greeting.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Greeting])], // 이 줄이 핵심!
  providers: [GreetingService],
  controllers: [GreetingController]
})
export class GreetingModule {}