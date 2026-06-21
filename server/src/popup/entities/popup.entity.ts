import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('popup')
export class Popup extends BaseEntity {
  @Column()
  imageUrl: string;

  @Column({ type: 'varchar', nullable: true })
  linkUrl: string | null;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;
}
