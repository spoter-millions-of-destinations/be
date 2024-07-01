import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { CustomBaseEntity } from '../../src/common/base/baseEntity';
import { Post } from './post.entity';

@Entity('users')
export class User extends CustomBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  password: string;

  @Unique('username', ['username'])
  @Column({ length: 200 })
  username: string;

  @Column('simple-array')
  roles: string[];

  @Column({ length: 500 })
  avatar: string;

  @Unique('email', ['email'])
  @Column({ length: 200 })
  email: string;

  @Column({ length: 20 })
  phoneNumber: string;

  @Column()
  isLocked: boolean;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
