import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('research')
export class Research extends BaseEntity {
  @Column()
  title: string;

  @Column()
  category: string;

  @Column()
  year: string;

  @Column()
  pdfUrl: string;

  @Column({ default: 0 })
  downloads: number;
}
