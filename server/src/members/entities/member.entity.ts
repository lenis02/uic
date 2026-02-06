import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('members')
export class Member extends BaseEntity {
  @Column()
  generation: number; // 기수 (예: 19)

  @Column()
  name: string;

  @Column()
  position: string; // 직책 (회장, 기획팀장 등)

  @Column({ type: 'varchar', nullable: true })
  workplace: string | null;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  imageUrl: string | null; // 프로필 사진 업로드 경로
}
