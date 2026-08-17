import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

// 배너를 붙일 위치. top = 네비 아래 고정 스트립, bottom = 화면 하단 고정 바.
export const AD_PLACEMENTS = ['top', 'bottom'] as const;
export type AdPlacement = (typeof AD_PLACEMENTS)[number];

// 띠 높이 허용 범위. 상단은 히어로를 밀어내지 않도록 58px을 넘지 못하게 한다.
export const BAR_HEIGHT_LIMITS: Record<AdPlacement, { min: number; max: number }> =
  {
    top: { min: 40, max: 58 },
    bottom: { min: 40, max: 66 },
  };

@Entity('advertisement')
export class Advertisement extends BaseEntity {
  @Column()
  placement: AdPlacement;

  @Column()
  imageUrl: string;

  @Column({ type: 'varchar', nullable: true })
  linkUrl: string | null;

  @Column({ default: '' })
  altText: string;

  @Column({ default: true })
  isActive: boolean;

  // 같은 위치에 여러 개면 이 순서대로 순환 노출된다.
  @Column({ default: 1 })
  sortOrder: number;
}
