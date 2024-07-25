import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CustomBaseEntity } from '../../src/common/base/baseEntity';
import { Post } from './post.entity';

@Entity('attractions')
export class Attraction extends CustomBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'numeric' })
  rate: number;

  @Column()
  placeName: string;

  @Column()
  address: string;

  @Column()
  ward: string;

  @Column()
  district: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column({ type: 'numeric' })
  latitude: number;

  @Column({ type: 'numeric' })
  longitude: number;

  @OneToMany(() => Post, (post) => post.attraction)
  posts: Post[];
}
