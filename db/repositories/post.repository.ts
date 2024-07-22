import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { GetPostsParamsDto } from '../../src/post/dtos/get-posts-input.dto';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(private dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Post> {
    const post = await this.findOne({ where: { id }, relations: ['user'] });
    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async getPosts(query: GetPostsParamsDto): Promise<[Post[], number]> {
    const qb = this.createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('post.description ILIKE :search', { search: `%${query.search ?? ''}%` })
      .skip(query.offset)
      .take(query.limit);

      query.rate && qb.andWhere('post.rate = :rate', { rate: query.rate });

      if (query.longitude && query.latitude) {
        qb.andWhere(
          `ST_DWithin(
              'SRID=4326;POINT(${query.longitude} ${query.latitude})'::geography,
              ST_SetSRID(ST_MakePoint("post"."longitude", "post"."latitude"), 4326)::geography,
              ${query.radius ?? 10000}
          )`
        )
        .orderBy(
          `ST_Distance(
              'SRID=4326;POINT(${query.longitude} ${query.latitude})'::geography,
              ST_SetSRID(ST_MakePoint("post"."longitude", "post"."latitude"), 4326)::geography
          )`,
          'ASC',

        );
      }
      else {
        qb.orderBy('post.createdAt', 'DESC');
      }
      console.log('qb.getQueryAndParameters()', qb.getQueryAndParameters());
    return await qb.getManyAndCount();
  }
}
