import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from './entities/partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
    private cloudinaryService: CloudinaryService,
  ) {}

  // 노출 순서는 항상 이름 가나다순.
  findAll() {
    return this.partnerRepository.find({ order: { name: 'ASC' } });
  }

  async create(dto: CreatePartnerDto, file?: Express.Multer.File) {
    let logoUrl: string | null = null;
    if (file) {
      const uploaded = await this.cloudinaryService.uploadLogo(file);
      logoUrl = (uploaded as any).secure_url;
    }

    const partner = this.partnerRepository.create({ name: dto.name, logoUrl });
    return this.partnerRepository.save(partner);
  }

  async update(
    id: number,
    dto: Partial<CreatePartnerDto>,
    file?: Express.Multer.File,
  ) {
    const partner = await this.partnerRepository.findOne({ where: { id } });
    if (!partner) {
      throw new NotFoundException(`협력사 ID ${id}를 찾을 수 없습니다.`);
    }

    if (file) {
      const uploaded = await this.cloudinaryService.uploadLogo(file);
      partner.logoUrl = (uploaded as any).secure_url;
    }
    if (dto.name !== undefined) partner.name = dto.name;

    return this.partnerRepository.save(partner);
  }

  async remove(id: number) {
    const result = await this.partnerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`협력사 ID ${id}를 찾을 수 없습니다.`);
    }
    return { message: '삭제되었습니다.' };
  }
}
