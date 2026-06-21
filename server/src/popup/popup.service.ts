import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Popup } from './entities/popup.entity';
import { CreatePopupDto } from './dto/create-popup.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PopupService {
  constructor(
    @InjectRepository(Popup)
    private popupRepository: Repository<Popup>,
    private cloudinaryService: CloudinaryService,
  ) {}

  findAll() {
    return this.popupRepository.find({ order: { createdAt: 'DESC' } });
  }

  findActive() {
    const now = new Date();
    return this.popupRepository
      .createQueryBuilder('popup')
      .where('popup.isActive = :isActive', { isActive: true })
      .andWhere('popup.startDate <= :now', { now })
      .andWhere('popup.endDate >= :now', { now })
      .orderBy('popup.createdAt', 'DESC')
      .getMany();
  }

  async create(dto: CreatePopupDto, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('이미지를 첨부해주세요.');
    const uploaded = await this.cloudinaryService.uploadAsWebp(file);
    const popup = this.popupRepository.create({
      imageUrl: (uploaded as any).secure_url,
      linkUrl: dto.linkUrl,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      isActive: dto.isActive !== undefined ? Boolean(dto.isActive) : true,
    });
    return this.popupRepository.save(popup);
  }

  async update(id: number, dto: Partial<CreatePopupDto>, file?: Express.Multer.File) {
    const popup = await this.popupRepository.findOne({ where: { id } });
    if (!popup) throw new NotFoundException(`팝업 ID ${id}를 찾을 수 없습니다.`);

    if (file) {
      const uploaded = await this.cloudinaryService.uploadAsWebp(file);
      popup.imageUrl = (uploaded as any).secure_url;
    }
    if (dto.linkUrl !== undefined) popup.linkUrl = dto.linkUrl || null;
    if (dto.startDate) popup.startDate = new Date(dto.startDate);
    if (dto.endDate) popup.endDate = new Date(dto.endDate);
    if (dto.isActive !== undefined) popup.isActive = Boolean(dto.isActive);

    return this.popupRepository.save(popup);
  }

  async remove(id: number) {
    const result = await this.popupRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`팝업 ID ${id}를 찾을 수 없습니다.`);
    }
    return { message: '삭제되었습니다.' };
  }
}
