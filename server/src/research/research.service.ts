// src/modules/research/research.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Research } from './entities/research.entity';
import { CreateResearchDto } from './dto/create-research.dto';

@Injectable()
export class ResearchService {
  constructor(
    @InjectRepository(Research)
    private researchRepository: Repository<Research>,
  ) {}

  async findAll() {
    return await this.researchRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreateResearchDto, pdfUrl: string, thumbnailUrl: string) {
    const research = this.researchRepository.create({
      ...dto,
      pdfUrl,
      thumbnailUrl,
    });
    return await this.researchRepository.save(research);
  }

  async remove(id: number) {
    const research = await this.researchRepository.findOne({ where: { id } });
    if (!research) throw new NotFoundException('리서치를 찾을 수 없습니다.');

    // TODO: 실제 서버에서 파일 삭제 로직을 추가하면 더 좋습니다 (fs.unlink)

    return await this.researchRepository.remove(research);
  }
}
