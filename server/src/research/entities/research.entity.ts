import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('research')
export class Research extends BaseEntity {
  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  pdfUrl: string;

  // 👇 [수정] type: 'varchar'를 명시해야 에러가 안 납니다!
  @Column({ type: 'varchar', nullable: true })
  thumbnailUrl: string | null;

  @Column({ default: 0 })
  views: number;

  // 👇 [수정] 여기도 type: 'text' (긴 글)라고 명시
  @Column({ type: 'text', nullable: true })
  description: string | null;
}
