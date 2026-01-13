import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('admins')
export class Admin extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ nullable: false }) // 해싱된 비밀번호
  password: string;

  @Column({ nullable: true })
  lastLogin: Date;
}
