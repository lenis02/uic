import { Injectable } from '@nestjs/common'; // NotFoundException 제거해도 됨
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Greeting } from './entities/greeting.entity';
import { CreateGreetingDto } from './dto/create-greeting.dto';

@Injectable()
export class GreetingService {
  constructor(
    @InjectRepository(Greeting)
    private greetingRepository: Repository<Greeting>,
  ) {}

  async findAll() {
    return await this.greetingRepository.find({ order: { id: 'ASC' } });
  }

  // 👇 [여기 수정] 데이터가 없으면 에러 대신 '빈 데이터' 반환
  async findOne(role: string) {
    const greeting = await this.greetingRepository.findOne({
      where: { role },
    });

    // 데이터가 없으면 프론트엔드가 깨지지 않게 '빈 껍데기'를 줍니다.
    if (!greeting) {
      // 프론트엔드가 기대하는 모든 키를 빈 문자열로 채워서 줍니다.
      return {
        role,
        name: '',
        fullRole: '',
        greeting: '',
        content: '',
        quote: '',
        imageUrl: null,
      };
    }
    return greeting;
  }

  async createOrUpdate(dto: CreateGreetingDto, imageUrl?: string) {
    const existing = await this.greetingRepository.findOne({
      where: { role: dto.role },
    });

    if (existing) {
      const updateData = imageUrl ? { ...dto, imageUrl } : dto;
      await this.greetingRepository.update(existing.id, updateData);
      return await this.greetingRepository.findOne({
        where: { id: existing.id },
      });
    }

    const newGreeting = this.greetingRepository.create({ ...dto, imageUrl });
    return await this.greetingRepository.save(newGreeting);
  }
}
