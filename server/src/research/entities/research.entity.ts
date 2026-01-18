import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('research')
export class Research extends BaseEntity {
  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  pdfUrl: string; // 업로드된 PDF 파일 경로

  @Column({ nullable: true })
  thumbnailUrl: string; // 업로드된 썸네일 이미지 경로

  @Column({ default: 0 })
  views: number;

  @Column({ nullable: true })
  description: string;
}
