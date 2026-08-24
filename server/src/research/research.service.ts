import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Research } from './entities/research.entity';
import { CreateResearchDto } from './dto/create-research.dto';
import { UpdateResearchDto } from './dto/update-research.dto';

@Injectable()
export class ResearchService {
  private readonly logger = new Logger(ResearchService.name);

  constructor(
    @InjectRepository(Research)
    private researchRepository: Repository<Research>,
  ) {}

  async findAll() {
    try {
      return await this.researchRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (err) {
      this.logger.error(
        'research.findAll failed (check DB columns vs Research entity / Render logs)',
        err instanceof Error ? err.stack : String(err),
      );
      throw err;
    }
  }

  async create(dto: CreateResearchDto) {
    const research = this.researchRepository.create(dto);
    return await this.researchRepository.save(research);
  }

  async update(id: number, dto: UpdateResearchDto) {
    const research = await this.researchRepository.findOne({ where: { id } });
    if (!research) throw new NotFoundException('리서치를 찾을 수 없습니다.');

    Object.assign(research, dto);

    return await this.researchRepository.save(research);
  }

  async remove(id: number) {
    const research = await this.researchRepository.findOne({ where: { id } });
    if (!research) throw new NotFoundException('리서치를 찾을 수 없습니다.');
    return await this.researchRepository.remove(research);
  }

  async increaseViewCount(id: number) {
    await this.researchRepository.increment({ id }, 'downloads', 1);
    return { success: true };
  }
}
