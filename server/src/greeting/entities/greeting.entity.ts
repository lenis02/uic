import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('greetings')
export class Greeting extends BaseEntity {
  @Column()
  role: string; // President, Vice President

  @Column()
  name: string;

  @Column()
  fullRole: string; // "제19대 전국 대학생 투자동아리 연합회 회장"

  @Column('text')
  greeting: string; // "안녕하십니까, ..."

  @Column('text')
  content: string; // 긴 본문 내용

  @Column()
  quote: string; // "지엽에 시선을 빼앗겨..."

  @Column()
  imageUrl: string; // 회장단 사진 경로
}
