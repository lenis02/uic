import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Greeting } from './entities/greeting.entity';
import { CreateGreetingDto } from './dto/create-greeting.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // 👈 Cloudinary Import 필수

@Injectable()
export class GreetingService {
  constructor(
    @InjectRepository(Greeting)
    private greetingRepository: Repository<Greeting>,
    private cloudinaryService: CloudinaryService, // 👈 주입
  ) {}

  async findAll() {
    return await this.greetingRepository.find({ order: { id: 'ASC' } });
  }

  // 👇 기존 로직 유지 (데이터 없으면 빈 껍데기 반환)
  async findOne(role: string) {
    const greeting = await this.greetingRepository.findOne({
      where: { role },
    });

    if (!greeting) {
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

  // 👇 [핵심 수정] file을 받아서 처리하는 로직으로 변경
  async createOrUpdate(
    dto: Partial<CreateGreetingDto> & { role: string },
    file?: Express.Multer.File,
  ) {
    // 1. 기존 데이터 조회
    const existing = await this.greetingRepository.findOne({
      where: { role: dto.role },
    });

    // 2. 파일이 있다면 Cloudinary 업로드
    let newImageUrl: string | null = null;
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      newImageUrl = uploadResult.secure_url;
    }

    // 3. 기존 데이터가 있는 경우 (업데이트)
    if (existing) {
      const updateData: any = { ...dto };

      // 새 이미지가 올라왔을 때만 imageUrl 교체 (없으면 기존 이미지 유지)
      if (newImageUrl) {
        updateData.imageUrl = newImageUrl;
      }

      await this.greetingRepository.update(existing.id, updateData);

      return await this.greetingRepository.findOne({
        where: { id: existing.id },
      });
    }

    // 4. 데이터가 없는 경우 (새로 생성)
    const newGreeting = this.greetingRepository.create({
      ...dto,
      imageUrl: newImageUrl, // 파일 없으면 null 들어감
    });
    return await this.greetingRepository.save(newGreeting);
  }
}
