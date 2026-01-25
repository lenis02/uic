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

  // [속도 개선] Promise.all로 병렬 업로드
  async create(
    dto: CreateResearchDto,
    files: { pdf?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
  ) {
    // 1. 업로드 작업을 동시에 시작 (await 없이 프로미스만 생성)
    const pdfUploadPromise =
      files.pdf && files.pdf[0]
        ? this.cloudinaryService.uploadImage(files.pdf[0])
        : Promise.resolve(null);

    const thumbUploadPromise =
      files.thumbnail && files.thumbnail[0]
        ? this.cloudinaryService.uploadImage(files.thumbnail[0])
        : Promise.resolve(null);

    // 2. 두 작업이 다 끝날 때까지 병렬 대기 (여기서 시간 단축됨!)
    const [pdfResult, thumbResult] = await Promise.all([
      pdfUploadPromise,
      thumbUploadPromise,
    ]);

    const research = this.researchRepository.create({
      ...dto,
      pdfUrl: pdfResult ? pdfResult.secure_url : '',
      thumbnailUrl: thumbResult ? thumbResult.secure_url : null,
    });

    return await this.researchRepository.save(research);
  }

  // [속도 개선] Update도 동일하게 적용
  async update(
    id: number,
    dto: Partial<CreateResearchDto>,
    files: { pdf?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
  ) {
    const research = await this.researchRepository.findOne({ where: { id } });
    if (!research) throw new NotFoundException('리서치를 찾을 수 없습니다.');

    Object.assign(research, dto);

    // 1. 업로드 동시 시작
    const pdfUploadPromise =
      files.pdf && files.pdf[0]
        ? this.cloudinaryService.uploadImage(files.pdf[0])
        : Promise.resolve(null);

    const thumbUploadPromise =
      files.thumbnail && files.thumbnail[0]
        ? this.cloudinaryService.uploadImage(files.thumbnail[0])
        : Promise.resolve(null);

    // 2. 병렬 대기
    const [pdfResult, thumbResult] = await Promise.all([
      pdfUploadPromise,
      thumbUploadPromise,
    ]);

    // 3. 결과 반영
    if (pdfResult) research.pdfUrl = pdfResult.secure_url;
    if (thumbResult) research.thumbnailUrl = thumbResult.secure_url;

    return await this.researchRepository.save(research);
  }

  async remove(id: number) {
    const research = await this.researchRepository.findOne({ where: { id } });
    if (!research) throw new NotFoundException('리서치를 찾을 수 없습니다.');
    return await this.researchRepository.remove(research);
  }
}
