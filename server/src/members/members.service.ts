// src/modules/members/members.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
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
    const memberData = { ...dto };

    // 파일이 있으면 이미지 경로 추가
    if (file) {
      memberData['imageUrl'] = `/uploads/${file.filename}`;
    }

    const member = this.memberRepository.create(memberData);
    return await this.memberRepository.save(member);
  }

  // [핵심 수정] update 메서드 로직 변경
  async update(
    id: number,
    dto: Partial<CreateMemberDto>,
    file?: Express.Multer.File, // 파일 인자 추가
  ) {
    const updateData = { ...dto };
    delete (updateData as any).id;

    // 1. 파일이 존재하면 이미지 경로를 업데이트 데이터에 추가
    if (file) {
      // Entity의 컬럼명이 'imageUrl'인지 'profileImageUrl'인지 확인 필요
      // 프론트엔드 인터페이스에 맞춰 'imageUrl'로 저장합니다.
      updateData['imageUrl'] = `/uploads/${file.filename}`;
    }

    // 2. preload로 기존 엔티티 + 변경 데이터 병합
    const member = await this.memberRepository.preload({
      id,
      ...updateData,
    });

    if (!member) throw new NotFoundException('멤버를 찾을 수 없습니다.');

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
