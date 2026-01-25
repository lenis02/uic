import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('research')
export class Research extends BaseEntity {
  @Column()
  title: string;

  @Column()
  category: string;

  @Column()
  author: string;

  @Column()
  pdfUrl: string;

  @Column({ type: 'varchar', nullable: true })
  thumbnailUrl: string | null;

  @Column({ default: 0 })
  views: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;
}
