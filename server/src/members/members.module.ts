// src/modules/members/members.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity'; // Member 엔티티 임포트
import { MembersService } from './members.service';
import { MembersController } from './members.controller';

@Module({
  // ⬇️ 이 부분이 핵심입니다!
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}
