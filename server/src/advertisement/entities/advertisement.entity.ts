import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

// anchored = 위치 고정형. 메인 페이지의 특정 섹션에 박혀 함께 스크롤된다.
// floating = 추적형. 좌우 여백에 고정되어 스크롤 내내 따라온다.
export const AD_TYPES = ['anchored', 'floating'] as const;
export type AdType = (typeof AD_TYPES)[number];

// 위치 고정형이 들어갈 수 있는 메인 페이지 섹션 (각 <section>의 id와 같다).
export const AD_SECTIONS = ['home', 'vision', 'network', 'partner'] as const;
export type AdSection = (typeof AD_SECTIONS)[number];

export const AD_EDGES = ['top', 'bottom'] as const;
export type AdEdge = (typeof AD_EDGES)[number];

export const AD_SIDES = ['left', 'right'] as const;
export type AdSide = (typeof AD_SIDES)[number];

// 소재 크기 허용 범위. 가로 띠(anchored)와 세로 스카이스크래퍼(floating)는 규격이 다르다.
export const AD_SIZE_LIMITS: Record<
  AdType,
  { minWidth: number; maxWidth: number; minHeight: number; maxHeight: number }
> = {
  anchored: { minWidth: 200, maxWidth: 1200, minHeight: 60, maxHeight: 300 },
  floating: { minWidth: 100, maxWidth: 200, minHeight: 200, maxHeight: 600 },
};

@Entity('advertisement')
export class Advertisement extends BaseEntity {
  @Column()
  type: AdType;

  // type이 anchored일 때만 사용
  @Column({ type: 'varchar', nullable: true })
  section: AdSection | null;

  @Column({ type: 'varchar', nullable: true })
  edge: AdEdge | null;

  // type이 floating일 때만 사용
  @Column({ type: 'varchar', nullable: true })
  side: AdSide | null;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  imageUrl: string;

  @Column({ type: 'varchar', nullable: true })
  linkUrl: string | null;

  @Column({ default: '' })
  altText: string;

  @Column({ default: true })
  isActive: boolean;

  // 같은 자리에 여러 개면 이 순서대로 순환 노출된다.
  @Column({ default: 1 })
  sortOrder: number;
}
