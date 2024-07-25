import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CustomBaseEntity } from '../../src/common/base/baseEntity';
import { Attraction } from './attraction.entity';
import { Comment } from './comment.entity';
import { Favorite } from './favorite.entity';
import { User } from './user.entity';

@Entity('posts')
export class Post extends CustomBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ type: 'text', array: true, nullable: true, default: [] })
  images: string[];

  @Column({ type: 'numeric' })
  longitude: number;

  @Column({ type: 'numeric' })
  latitude: number;

  @Column()
  userId: number;

  @Column()
  rate: number;

  @Column()
  attractionId: number;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Favorite, (favorite) => favorite.post)
  favorites: Favorite[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @ManyToOne(() => Attraction, (attraction) => attraction.posts)
  @JoinColumn({ name: 'attractionId' })
  attraction: Attraction;

  //Virtual column
  @Column({
    type: 'bit',
    select: false,
    insert: false,
    update: false,
    nullable: true,
  })
  isFavorite: boolean;
}
