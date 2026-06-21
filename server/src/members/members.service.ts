// src/modules/members/members.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async findAll() {
    return await this.memberRepository.find({
      order: { generation: 'DESC', id: 'ASC' },
    });
  }

  async findByGeneration(gen: number) {
    return await this.memberRepository.find({
      where: { generation: gen },
      order: { id: 'ASC' },
    });
  }

  // 🔹 생성 로직
  async create(dto: CreateMemberDto, file?: Express.Multer.File) {
    // 1️⃣ 타입 에러 해결: string | null 명시
    let uploadedImageUrl: string | null = null;

    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      uploadedImageUrl = uploadResult.secure_url;
    }

    const member = this.memberRepository.create({
      ...dto,
      imageUrl: uploadedImageUrl,
    });
    return await this.memberRepository.save(member);
  }

  // 🔹 수정 로직
  async update(
    id: number,
    dto: Partial<CreateMemberDto> & { deleteImage?: string },
    file?: Express.Multer.File,
  ) {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) throw new NotFoundException('멤버를 찾을 수 없습니다.');

    // 2️⃣ 순서 중요: 텍스트 정보를 먼저 덮어쓰고... (deleteImage는 컬럼이 아니므로 제외)
    const { deleteImage, ...rest } = dto;
    Object.assign(member, rest);

    // 빈 문자열로 들어온 선택 항목은 null로 정규화 (update는 검증/변환을 거치지 않음)
    if (member.email === '') member.email = null;
    if (member.workplace === '') member.workplace = null;

    // 3️⃣ 파일이 새로 왔을 때만 이미지 교체! (덮어쓰기 방지)
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      member.imageUrl = uploadResult.secure_url;
    } else if (deleteImage === 'true') {
      // 4️⃣ 파일은 없고 삭제 요청만 온 경우 이미지 제거
      member.imageUrl = null;
    }

    return await this.memberRepository.save(member);
  }

  async remove(id: number) {
    const result = await this.memberRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('멤버를 찾을 수 없습니다.');
    return { message: '삭제되었습니다.' };
  }

  async createNextGeneration() {
    const lastMember = await this.memberRepository.findOne({
      where: {},
      order: { generation: 'DESC' },
    });

    const nextGen = lastMember ? lastMember.generation + 1 : 1;

    const defaultPositions = [
      '회장',
      '부회장',
      '기획',
      '대외협력',
      '마케팅',
      '재무',
      '인사',
    ];

    // 4️⃣ 엔티티 타입을 string | null로 고쳤다면 여기 에러도 사라집니다.
    const newMembers = defaultPositions.map((pos) => {
      return this.memberRepository.create({
        generation: nextGen,
        name: '이름을 입력하세요',
        position: pos,
        workplace: null,
        email: null,
        imageUrl: null,
      });
    });

    return await this.memberRepository.save(newMembers);
  }
}
