import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CustomBaseEntity } from '../../common/base/baseEntity';
import { User } from '../../user/entities/user.entity';

@Entity('posts')
export class Post extends CustomBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ type: 'text', array: true, nullable: true, default: [] })
  images: string[];

  @Column()
  longitude: number;

  @Column()
  latitude: number;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
