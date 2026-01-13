import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('history')
export class History extends BaseEntity {
  @Column()
  year: string; // 2024

  @Column()
  date: string; // 08.22

  @Column()
  title: string;

  @Column({ nullable: true })
  type: string; // MOU, Contest 등 (선택 사항)

  @Column({ nullable: true })
  description: string; // 상세(주최 등 - 선택 사항)
}
