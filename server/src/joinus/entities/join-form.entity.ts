import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

// JoinUs 페이지의 카드 3종. 값은 프론트의 카드 순서와 동일하다.
export const JOIN_FORM_TYPES = ['club', 'individual', 'joint'] as const;
export type JoinFormType = (typeof JOIN_FORM_TYPES)[number];

@Entity('join_form')
export class JoinForm extends BaseEntity {
  @Column({ unique: true })
  type: JoinFormType;

  // 카드 제목 아래에 들어가는 한 문단 설명.
  @Column('text')
  description: string;

  // 불릿 목록. 줄바꿈으로 구분해 한 줄에 하나씩 저장한다.
  @Column('text')
  bullets: string;

  @Column({ type: 'varchar', nullable: true })
  fileUrl: string | null;

  // 원본 파일명. 관리자 화면에서 어떤 파일이 올라가 있는지 보여주는 용도.
  @Column({ type: 'varchar', nullable: true })
  fileName: string | null;
}
