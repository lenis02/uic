import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  JoinForm,
  JOIN_FORM_TYPES,
  JoinFormType,
} from './entities/join-form.entity';
import { UpdateJoinFormDto } from './dto/update-join-form.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class JoinusService {
  constructor(
    @InjectRepository(JoinForm)
    private joinFormRepository: Repository<JoinForm>,
    private cloudinaryService: CloudinaryService,
  ) {}

  // 카드 3종은 항상 club -> individual -> joint 순으로 내려준다.
  // 아직 저장된 적 없는 종류는 빈 껍데기로 채워서 프론트가 자리를 잃지 않게 한다.
  async findAll() {
    const saved = await this.joinFormRepository.find();
    const byType = new Map(saved.map((form) => [form.type, form]));

    return JOIN_FORM_TYPES.map(
      (type) =>
        byType.get(type) ?? {
          type,
          description: '',
          bullets: '',
          fileUrl: null,
          fileName: null,
        },
    );
  }

  async update(
    type: JoinFormType,
    dto: UpdateJoinFormDto,
    file?: Express.Multer.File,
  ) {
    const existing = await this.joinFormRepository.findOne({ where: { type } });

    // 새 파일을 올렸을 때만 교체한다. 안 올리면 기존 파일 유지.
    let uploadedUrl: string | null = null;
    if (file) {
      const uploaded = await this.cloudinaryService.uploadDocument(file);
      uploadedUrl = (uploaded as { secure_url: string }).secure_url;
    }

    if (existing) {
      if (dto.description !== undefined) existing.description = dto.description;
      if (dto.bullets !== undefined) existing.bullets = dto.bullets;
      if (file) {
        existing.fileUrl = uploadedUrl;
        existing.fileName = file.originalname;
      }
      return this.joinFormRepository.save(existing);
    }

    const created = this.joinFormRepository.create({
      type,
      description: dto.description ?? '',
      bullets: dto.bullets ?? '',
      fileUrl: uploadedUrl,
      fileName: file ? file.originalname : null,
    });
    return this.joinFormRepository.save(created);
  }

  assertValidType(type: string): JoinFormType {
    if (!JOIN_FORM_TYPES.includes(type as JoinFormType)) {
      throw new NotFoundException(
        `지원 종류 '${type}'는 존재하지 않습니다. (${JOIN_FORM_TYPES.join(', ')})`,
      );
    }
    return type as JoinFormType;
  }
}
