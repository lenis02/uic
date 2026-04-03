import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Research } from './entities/research.entity';
import { CreateResearchDto } from './dto/create-research.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ResearchService {
  constructor(
    @InjectRepository(Research)
    private researchRepository: Repository<Research>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async findAll() {
    return await this.researchRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async create(
    dto: CreateResearchDto,
    files: { pdf?: Express.Multer.File[] },
  ) {
    const pdfResult =
      files.pdf && files.pdf[0]
        ? await this.cloudinaryService.uploadImage(files.pdf[0])
        : null;

    const research = this.researchRepository.create({
      ...dto,
      pdfUrl: pdfResult ? pdfResult.secure_url : '',
    });

    return await this.researchRepository.save(research);
  }

  async update(
    id: number,
    dto: Partial<CreateResearchDto>,
    files: { pdf?: Express.Multer.File[] },
  ) {
    const research = await this.researchRepository.findOne({ where: { id } });
    if (!research) throw new NotFoundException('리서치를 찾을 수 없습니다.');

    Object.assign(research, dto);

    if (files.pdf && files.pdf[0]) {
      const pdfResult = await this.cloudinaryService.uploadImage(files.pdf[0]);
      research.pdfUrl = pdfResult.secure_url;
    }

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
