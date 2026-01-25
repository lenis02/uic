import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('greetings')
export class Greeting extends BaseEntity {
  @Column()
  role: string;

  @Column()
  name: string;

  @Column()
  fullRole: string;

  @Column('text')
  greeting: string;

  @Column('text')
  content: string;

  @Column()
  quote: string;

  // 👇 [수정] type: 'varchar'를 꼭 넣어줘야 합니다!
  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;
}
