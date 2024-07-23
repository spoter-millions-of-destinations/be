import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Collection } from '../entities/collection.entity';

@Injectable()
export class CollectionRepository extends Repository<Collection> {
  constructor(private dataSource: DataSource) {
    super(Collection, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Collection | null> {
    return await this.findOne({
      where: { id },
      relations: [
        'user',
        'collectionItems',
        'collectionItems.post',
        'collectionItems.post.user',
      ],
    });
  }

  async getCollections(
    userId: number,
    skip: number,
    take: number,
    postId?: number,
  ): Promise<[Collection[], number]> {
    const queryBuilder = this.createQueryBuilder('collection')
      .where('collection.userId = :userId', { userId })
      .leftJoinAndSelect('collection.user', 'user')
      .leftJoin('collection.collectionItems', 'collectionItems')
      .skip(skip)
      .take(take);

    postId &&
      queryBuilder.addSelect(
        `Case when collectionItems.postId = ${postId} then 1 else 0 end`,
        'collection_isAdded',
      );

    return await queryBuilder.getManyAndCount();
  }
}
