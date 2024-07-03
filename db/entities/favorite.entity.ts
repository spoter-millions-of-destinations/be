import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CustomBaseEntity } from '../../src/common/base/baseEntity';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity('favorites')
export class Favorite extends CustomBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  postId: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Post, (post) => post.favorites)
  post: Post;
}
