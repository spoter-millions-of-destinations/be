import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CustomBaseEntity } from '../../src/common/base/baseEntity';
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

  @Column()
  longitude: number;

  @Column()
  latitude: number;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @OneToMany(() => Favorite, (favorite) => favorite.post)
  favorites: Favorite[];

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
