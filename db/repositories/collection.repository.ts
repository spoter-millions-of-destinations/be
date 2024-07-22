import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Collection } from '../entities/collection.entity';

@Injectable()
export class CollectionRepository extends Repository<Collection> {
  constructor(private dataSource: DataSource) {
    super(Collection, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Collection | null> {
    return await this.findOne({ where: { id }, relations: ['user', 'collectionItems', 'collectionItems.post', 'collectionItems.post.user'] });
  }
}
