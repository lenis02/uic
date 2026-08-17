import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Advertisement,
  AD_SIZE_LIMITS,
} from './entities/advertisement.entity';
import type { AdType } from './entities/advertisement.entity';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AdvertisementService {
  constructor(
    @InjectRepository(Advertisement)
    private adRepository: Repository<Advertisement>,
    private cloudinaryService: CloudinaryService,
  ) {}

  findAll(activeOnly: boolean) {
    return this.adRepository.find({
      where: activeOnly ? { isActive: true } : {},
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
  }

  // type에 맞는 자리 정보가 왔는지, 크기가 규격 안인지 검사한다.
  private validateSlot(
    type: AdType,
    slot: { section?: string | null; edge?: string | null; side?: string | null },
    size: { width: number; height: number },
  ) {
    if (type === 'anchored' && (!slot.section || !slot.edge)) {
      throw new BadRequestException(
        '위치 고정형은 넣을 섹션과 위/아래를 선택해야 합니다.',
      );
    }
    if (type === 'floating' && !slot.side) {
      throw new BadRequestException('추적형은 좌우 중 한쪽을 선택해야 합니다.');
    }

    const limit = AD_SIZE_LIMITS[type];
    if (size.width < limit.minWidth || size.width > limit.maxWidth) {
      throw new BadRequestException(
        `가로 크기는 ${limit.minWidth}~${limit.maxWidth}px 사이여야 합니다.`,
      );
    }
    if (size.height < limit.minHeight || size.height > limit.maxHeight) {
      throw new BadRequestException(
        `세로 크기는 ${limit.minHeight}~${limit.maxHeight}px 사이여야 합니다.`,
      );
    }
  }

  async create(dto: CreateAdvertisementDto, file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('광고 이미지를 첨부해주세요.');
    }
    this.validateSlot(dto.type, dto, dto);

    const uploaded = await this.cloudinaryService.uploadImage(file);

    const last = await this.adRepository.findOne({
      where: { type: dto.type },
      order: { sortOrder: 'DESC' },
    });

    const ad = this.adRepository.create({
      type: dto.type,
      // 쓰지 않는 쪽은 확실히 비워둔다. 타입을 바꿔도 옛 값이 남지 않게.
      section: dto.type === 'anchored' ? (dto.section ?? null) : null,
      edge: dto.type === 'anchored' ? (dto.edge ?? null) : null,
      side: dto.type === 'floating' ? (dto.side ?? null) : null,
      width: dto.width,
      height: dto.height,
      imageUrl: uploaded.secure_url,
      linkUrl: dto.linkUrl ?? null,
      altText: dto.altText ?? '',
      isActive: dto.isActive ?? true,
      sortOrder: (last?.sortOrder ?? 0) + 1,
    });
    return this.adRepository.save(ad);
  }

  async update(
    id: number,
    dto: UpdateAdvertisementDto,
    file?: Express.Multer.File,
  ) {
    const ad = await this.adRepository.findOne({ where: { id } });
    if (!ad) {
      throw new NotFoundException(`광고 ID ${id}를 찾을 수 없습니다.`);
    }

    const type = dto.type ?? ad.type;
    const merged = {
      section: dto.section !== undefined ? dto.section : ad.section,
      edge: dto.edge !== undefined ? dto.edge : ad.edge,
      side: dto.side !== undefined ? dto.side : ad.side,
      width: dto.width ?? ad.width,
      height: dto.height ?? ad.height,
    };
    this.validateSlot(type, merged, merged);

    // 새 이미지를 올렸을 때만 교체한다.
    if (file) {
      const uploaded = await this.cloudinaryService.uploadImage(file);
      ad.imageUrl = uploaded.secure_url;
    }

    ad.type = type;
    ad.section = type === 'anchored' ? (merged.section ?? null) : null;
    ad.edge = type === 'anchored' ? (merged.edge ?? null) : null;
    ad.side = type === 'floating' ? (merged.side ?? null) : null;
    ad.width = merged.width;
    ad.height = merged.height;
    if (dto.linkUrl !== undefined) ad.linkUrl = dto.linkUrl || null;
    if (dto.altText !== undefined) ad.altText = dto.altText;
    if (dto.isActive !== undefined) ad.isActive = dto.isActive;

    return this.adRepository.save(ad);
  }

  async remove(id: number) {
    const result = await this.adRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`광고 ID ${id}를 찾을 수 없습니다.`);
    }
    return { message: '삭제되었습니다.' };
  }
}
