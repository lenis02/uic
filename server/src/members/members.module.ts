import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { Member } from './entities/member.entity';
// 👇 [추가 1] 경로에 맞춰 import 하세요
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    CloudinaryModule, // 👈 [추가 2] 여기에 꼭 넣어야 서비스에서 쓸 수 있습니다!
  ],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
