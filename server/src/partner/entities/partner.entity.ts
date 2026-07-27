import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('partner')
export class Partner extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  logoUrl: string | null;
}
