import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

export type NetworkCategory = 'university' | 'club';

@Entity('network')
export class Network extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'varchar', default: 'university' })
  category: NetworkCategory;

  @Column({ type: 'varchar', nullable: true })
  logoUrl: string | null;

  // 로고가 밝은 색이라 흰 배경에서 보이지 않는 경우 어두운 배경을 깔아준다.
  @Column({ default: false })
  darkBg: boolean;
}
