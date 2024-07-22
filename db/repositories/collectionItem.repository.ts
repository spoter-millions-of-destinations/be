import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';

import { CollectionItem } from '../entities/collectionItem.entity';

@Injectable()
export class CollectionItemRepository extends Repository<CollectionItem> {
  constructor(private dataSource: DataSource) {
    super(CollectionItem, dataSource.createEntityManager());
  }

  async checkIfPostIsInCollections(postId: number, collectionIds: number[]): Promise<boolean> {
    const collectionItem = await this.findOne({
      where: {
        postId,
        collectionId: In(collectionIds),
      },
    });

    return !!collectionItem;
  }
}
