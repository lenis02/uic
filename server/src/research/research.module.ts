import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 추가
import { Research } from './entities/research.entity'; // 추가
import { ResearchService } from './research.service';
import { ResearchController } from './research.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Research])], // 이 줄이 핵심!
  providers: [ResearchService],
  controllers: [ResearchController]
})
export class ResearchModule {}