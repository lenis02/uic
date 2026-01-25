import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GreetingService } from './greeting.service';
import { GreetingController } from './greeting.controller';
import { Greeting } from './entities/greeting.entity';
// 👇 [추가]
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Greeting]),
    CloudinaryModule, // 👈 [추가] 필수!
  ],
  controllers: [GreetingController],
  providers: [GreetingService],
})
export class GreetingModule {}
