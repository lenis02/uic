import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    private cloudinaryService: CloudinaryService,
  ) {}

  // 노출 순서는 sortOrder 오름차순. 동일하면 먼저 등록된 순서.
  findAll() {
    return this.activityRepository.find({
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
  }

  async create(dto: CreateActivityDto, file?: Express.Multer.File) {
    let imageUrl: string | null = null;
    if (file) {
      const uploaded = await this.cloudinaryService.uploadImage(file);
      imageUrl = uploaded.secure_url;
    }

    // 새 활동은 항상 맨 아래에 붙인다. 순서 변경은 reorder로 따로 한다.
    const last = await this.activityRepository.findOne({
      where: {},
      order: { sortOrder: 'DESC' },
    });

    const activity = this.activityRepository.create({
      title: dto.title,
      description: dto.description,
      sortOrder: (last?.sortOrder ?? 0) + 1,
      imageUrl,
    });
    return this.activityRepository.save(activity);
  }

  // 받은 id 순서대로 sortOrder를 1부터 다시 매긴다.
  async reorder(ids: number[]) {
    const activities = await this.activityRepository.find();
    const known = new Set(activities.map((a) => a.id));

    const missing = ids.filter((id) => !known.has(id));
    if (missing.length > 0) {
      throw new NotFoundException(
        `활동 ID ${missing.join(', ')}를 찾을 수 없습니다.`,
      );
    }

    await this.activityRepository.save(
      ids.map((id, index) => ({ id, sortOrder: index + 1 })),
    );

    return this.findAll();
  }

  async update(
    id: number,
    dto: UpdateActivityDto,
    file?: Express.Multer.File,
  ) {
    const activity = await this.activityRepository.findOne({ where: { id } });
    if (!activity) {
      throw new NotFoundException(`활동 ID ${id}를 찾을 수 없습니다.`);
    }

    // 새 이미지를 올렸을 때만 교체한다. 안 올리면 기존 이미지 유지.
    if (file) {
      const uploaded = await this.cloudinaryService.uploadImage(file);
      activity.imageUrl = uploaded.secure_url;
    }
    if (dto.title !== undefined) activity.title = dto.title;
    if (dto.description !== undefined) activity.description = dto.description;

    return this.activityRepository.save(activity);
  }

  async remove(id: number) {
    const result = await this.activityRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`활동 ID ${id}를 찾을 수 없습니다.`);
    }
    return { message: '삭제되었습니다.' };
  }
}
