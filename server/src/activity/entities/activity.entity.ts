import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('activity')
export class Activity extends BaseEntity {
  @Column()
  title: string;

  // 불릿 목록. 줄바꿈으로 구분해 한 줄에 하나씩 저장한다.
  @Column('text')
  description: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  // 1부터 시작. 작을수록 위에 노출된다.
  @Column({ default: 1 })
  sortOrder: number;
}
