import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CustomBaseEntity } from '../../src/common/base/baseEntity';
import { Collection } from './collection.entity';
import { Post } from './post.entity';

@Entity('collection_items')
export class CollectionItem extends CustomBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  collectionId: number;

  @Column()
  postId: number;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne(() => Collection, (collection) => collection.collectionItems)
  @JoinColumn({ name: 'collectionId' })
  collection: Collection;
}
