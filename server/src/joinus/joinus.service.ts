import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  JoinForm,
  JOIN_FORM_TYPES,
  JoinFormType,
} from './entities/join-form.entity';
import { UpdateJoinFormDto } from './dto/update-join-form.dto';

@Injectable()
export class JoinusService {
  constructor(
    @InjectRepository(JoinForm)
    private joinFormRepository: Repository<JoinForm>,
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

  async update(type: JoinFormType, dto: UpdateJoinFormDto) {
    const existing = await this.joinFormRepository.findOne({ where: { type } });

    if (existing) {
      if (dto.description !== undefined) existing.description = dto.description;
      if (dto.bullets !== undefined) existing.bullets = dto.bullets;
      // 새 파일 URL이 왔을 때만 교체한다. 안 보내면 기존 파일 유지.
      if (dto.fileUrl !== undefined) {
        existing.fileUrl = dto.fileUrl;
        existing.fileName = dto.fileName ?? dto.fileUrl;
      }
      return this.joinFormRepository.save(existing);
    }

    const created = this.joinFormRepository.create({
      type,
      description: dto.description ?? '',
      bullets: dto.bullets ?? '',
      fileUrl: dto.fileUrl ?? null,
      fileName: dto.fileUrl ? (dto.fileName ?? dto.fileUrl) : null,
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
