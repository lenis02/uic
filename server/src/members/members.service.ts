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

  // [수정] create 메서드도 파일 처리
  async create(dto: CreateMemberDto, file?: Express.Multer.File) {
    let uploadedImageUrl = null; // 초기값은 null (이미지 없을 경우)

    // 파일이 있으면 Cloudinary에 업로드
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      uploadedImageUrl = uploadResult.secure_url;
    }

    const member = this.memberRepository.create({
      ...dto,
      imageUrl: uploadedImageUrl, // ✅ 수정됨: image -> imageUrl
    });
    return await this.memberRepository.save(member);
  }

  async update(
    id: number,
    dto: Partial<CreateMemberDto>,
    file?: Express.Multer.File,
  ) {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) throw new NotFoundException('멤버를 찾을 수 없습니다.');

    // 새 파일이 올라오면 URL 교체
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      member.imageUrl = uploadResult.secure_url; // ✅ 수정됨: image -> imageUrl
    }

    Object.assign(member, dto);
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

    const newMembers = defaultPositions.map((pos) => {
      return this.memberRepository.create({
        generation: nextGen,
        name: '이름을 입력하세요',
        position: pos,
        imageUrl: null, // 초기 생성 시 이미지 없음
      });
    });

    return await this.memberRepository.save(newMembers);
  }
}
