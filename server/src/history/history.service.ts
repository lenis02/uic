// src/modules/history/history.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';
import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private historyRepository: Repository<History>,
  ) {}

  // 전체 조회 (최신 연도순, 같은 연도 내에서는 최신 날짜순)
  async findAll() {
    return await this.historyRepository.find({
      order: {
        year: 'DESC',
        date: 'DESC',
      },
    });
  }

  // 연혁 추가 (관리자 전용)
  async create(createHistoryDto: CreateHistoryDto) {
    const history = this.historyRepository.create(createHistoryDto);
    return await this.historyRepository.save(history);
  }

  // 연혁 삭제 (관리자 전용)
  async remove(id: number) {
    const result = await this.historyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`ID ${id}인 연혁을 찾을 수 없습니다.`);
    }
    return { message: '삭제되었습니다.' };
  }
}
