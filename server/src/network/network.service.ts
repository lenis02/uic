import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Network } from './entities/network.entity';
import { CreateNetworkDto } from './dto/create-network.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class NetworkService {
  constructor(
    @InjectRepository(Network)
    private networkRepository: Repository<Network>,
    private cloudinaryService: CloudinaryService,
  ) {}

  // 노출 순서는 대학 → 연합동아리, 각 그룹 안에서는 이름 가나다순.
  findAll() {
    return this.networkRepository
      .createQueryBuilder('network')
      .orderBy(
        `CASE WHEN network.category = 'university' THEN 0 ELSE 1 END`,
        'ASC',
      )
      .addOrderBy('network.name', 'ASC')
      .getMany();
  }

  async create(dto: CreateNetworkDto, file?: Express.Multer.File) {
    let logoUrl: string | null = null;
    if (file) {
      const uploaded = await this.cloudinaryService.uploadLogo(file);
      logoUrl = (uploaded as any).secure_url;
    }

    const network = this.networkRepository.create({
      name: dto.name,
      logoUrl,
      category: dto.category ?? 'university',
      darkBg: dto.darkBg ?? false,
    });
    return this.networkRepository.save(network);
  }

  async update(
    id: number,
    dto: Partial<CreateNetworkDto>,
    file?: Express.Multer.File,
  ) {
    const network = await this.networkRepository.findOne({ where: { id } });
    if (!network) {
      throw new NotFoundException(`참여 대학 ID ${id}를 찾을 수 없습니다.`);
    }

    if (file) {
      const uploaded = await this.cloudinaryService.uploadLogo(file);
      network.logoUrl = (uploaded as any).secure_url;
    }
    if (dto.name !== undefined) network.name = dto.name;
    if (dto.category !== undefined) network.category = dto.category;
    if (dto.darkBg !== undefined) network.darkBg = Boolean(dto.darkBg);

    return this.networkRepository.save(network);
  }

  async remove(id: number) {
    const result = await this.networkRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`참여 대학 ID ${id}를 찾을 수 없습니다.`);
    }
    return { message: '삭제되었습니다.' };
  }
}
