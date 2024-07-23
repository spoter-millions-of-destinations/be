import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CustomBaseEntity } from '../../src/common/base/baseEntity';
import { CollectionItem } from './collectionItem.entity';
import { User } from './user.entity';

@Entity('collections')
export class Collection extends CustomBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.collections)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => CollectionItem, (collectionItem) => collectionItem.collection)
  collectionItems: CollectionItem[];

  //Virtual column
  @Column({
    type: 'bit',
    select: false,
    insert: false,
    update: false,
    nullable: true,
  })
  isAdded: boolean;
}
