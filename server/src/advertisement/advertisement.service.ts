import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Advertisement,
  AD_PLACEMENTS,
  AdPlacement,
  BAR_HEIGHT_LIMITS,
} from './entities/advertisement.entity';
import { AdPlacementSetting } from './entities/ad-placement.entity';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AdvertisementService {
  constructor(
    @InjectRepository(Advertisement)
    private adRepository: Repository<Advertisement>,
    @InjectRepository(AdPlacementSetting)
    private placementRepository: Repository<AdPlacementSetting>,
    private cloudinaryService: CloudinaryService,
  ) {}

  // 위치별로 묶어서 내려준다. activeOnly는 공개 화면용.
  async findGrouped(activeOnly: boolean) {
    const ads = await this.adRepository.find({
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
    const settings = await this.placementRepository.find();

    return AD_PLACEMENTS.map((placement) => ({
      placement,
      barHeight:
        settings.find((s) => s.placement === placement)?.barHeight ??
        BAR_HEIGHT_LIMITS[placement].max,
      ads: ads.filter(
        (ad) => ad.placement === placement && (!activeOnly || ad.isActive),
      ),
    }));
  }

  async create(dto: CreateAdvertisementDto, file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('광고 이미지를 첨부해주세요.');
    }

    const uploaded = await this.cloudinaryService.uploadImage(file);

    // 새 광고는 같은 위치의 맨 뒤에 붙는다.
    const last = await this.adRepository.findOne({
      where: { placement: dto.placement },
      order: { sortOrder: 'DESC' },
    });

    const ad = this.adRepository.create({
      placement: dto.placement,
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

    // 새 이미지를 올렸을 때만 교체한다.
    if (file) {
      const uploaded = await this.cloudinaryService.uploadImage(file);
      ad.imageUrl = uploaded.secure_url;
    }
    if (dto.placement !== undefined) ad.placement = dto.placement;
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

  async updatePlacement(placement: AdPlacement, barHeight: number) {
    const limit = BAR_HEIGHT_LIMITS[placement];
    if (barHeight < limit.min || barHeight > limit.max) {
      throw new BadRequestException(
        `${placement} 띠 높이는 ${limit.min}~${limit.max}px 사이여야 합니다.`,
      );
    }

    const existing = await this.placementRepository.findOne({
      where: { placement },
    });

    if (existing) {
      existing.barHeight = barHeight;
      return this.placementRepository.save(existing);
    }

    return this.placementRepository.save(
      this.placementRepository.create({ placement, barHeight }),
    );
  }

  assertValidPlacement(placement: string): AdPlacement {
    if (!AD_PLACEMENTS.includes(placement as AdPlacement)) {
      throw new NotFoundException(
        `광고 위치 '${placement}'는 존재하지 않습니다. (${AD_PLACEMENTS.join(', ')})`,
      );
    }
    return placement as AdPlacement;
  }
}
