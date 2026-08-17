import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import type { AdPlacement } from './advertisement.entity';

// 위치별 설정. 광고는 순환 노출되므로 띠 높이는 광고가 아니라 위치에 붙는다.
@Entity('ad_placement')
export class AdPlacementSetting extends BaseEntity {
  @Column({ unique: true })
  placement: AdPlacement;

  @Column()
  barHeight: number;
}
