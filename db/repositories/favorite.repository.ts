import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Favorite } from '../entities/favorite.entity';

@Injectable()
export class FavoriteRepository extends Repository<Favorite> {
  constructor(private dataSource: DataSource) {
    super(Favorite, dataSource.createEntityManager());
  }

  async checkFavorite(userId: number, postId: number): Promise<boolean> {
    const favorite = await this.createQueryBuilder('favorite')
      .where('favorite.userId = :userId', { userId })
      .andWhere('favorite.postId = :postId', { postId })
      .getOne();

    return !!favorite;
  }

  async getFavoritesByUserId(userId: number): Promise<Favorite[]> {
    return this.createQueryBuilder('favorite')
      .where('favorite.userId = :userId', { userId })
      .getMany();
  }

  async getFavoritesByPostIdAndUserId(
    userId: number,
    postId: number,
  ): Promise<Favorite | null> {
    return this.createQueryBuilder('favorite')
      .where('favorite.userId = :userId', { userId })
      .andWhere('favorite.postId = :postId', { postId })
      .getOne();
  }

  async saveFavorite(userId: number, postId: number): Promise<Favorite> {
    const favorite = new Favorite();
    favorite.userId = userId;
    favorite.postId = postId;

    return this.save(favorite);
  }
}
