import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResearchService } from './research.service';
import { ResearchController } from './research.controller';
import { Research } from './entities/research.entity';
// 👇 [추가]
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Research]),
    CloudinaryModule, // 👈 [추가] 필수!
  ],
  controllers: [ResearchController],
  providers: [ResearchService],
})
export class ResearchModule {}
