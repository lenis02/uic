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

  // 1. 전체 조회
  async findAll() {
    return await this.memberRepository.find({
      // [중요] 이름을 수정해도 순서가 바뀌지 않으려면 'id' 기준으로 정렬해야 합니다.
      // 기존: name: 'ASC' -> 이름 바꾸면 순서 바뀜
      // 변경: id: 'ASC' -> 등록순(고정)
      order: { generation: 'DESC', id: 'ASC' },
    });
  }

  // 2. 특정 기수 조회
  async findByGeneration(gen: number) {
    return await this.memberRepository.find({
      where: { generation: gen },
      order: { id: 'ASC' }, // 여기도 id 순으로 고정 추천
    });
  }

  // 3. 멤버 추가
  async create(dto: CreateMemberDto) {
    const member = this.memberRepository.create(dto);
    return await this.memberRepository.save(member);
  }

  // 4. 멤버 정보 수정 (핵심 로직 개선)
  async update(id: number, dto: Partial<CreateMemberDto>) {
    // [안전 장치] DTO에 혹시 id가 들어있다면 제거합니다.
    // (JavaScript에서는 const { id, ...rest } = dto; 문법 사용 가능)
    const updateData = { ...dto };
    delete (updateData as any).id;

    // preload: 해당 id를 가진 엔티티를 찾아 updateData를 덮어씌운 객체를 만듦
    const member = await this.memberRepository.preload({
      id, // URL 파라미터로 받은 id를 기준 (절대 불변)
      ...updateData, // 변경할 데이터만 병합
    });

    if (!member) throw new NotFoundException('멤버를 찾을 수 없습니다.');

    return await this.memberRepository.save(member);
  }

  // 5. 멤버 삭제
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
        school: '학교를 입력하세요',
        position: pos,
        profileImageUrl: null,
      });
    });

    return await this.memberRepository.save(newMembers);
  }
}
