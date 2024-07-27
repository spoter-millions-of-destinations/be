import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CustomBaseEntity } from '../../src/common/base/baseEntity';
import { AdvertisingPackage } from './advertisingPackage.entity';
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

  @Column()
  advertisingPackageId: number;

  @OneToMany(() => Post, (post) => post.attraction)
  posts: Post[];

  @ManyToOne(() => AdvertisingPackage)
  @JoinColumn({ name: 'advertisingPackageId' })
  advertisingPackage: AdvertisingPackage;
}
