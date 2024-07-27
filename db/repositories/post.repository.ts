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
    const post = await this.findOne({ where: { id }, relations: ['user', 'attraction'] });
    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async getNormalPosts(query: GetPostsParamsDto): Promise<[Post[], number]> {
    const limit = query.limit - (query.limit / 5);
    const qb = this.createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.attraction', 'attraction')
      .where('post.description ILIKE :search', { search: `%${query.search ?? ''}%` })
      .andWhere('attraction.advertisingPackageId IS NULL')
      .skip(query.offset)
      .take(limit);

      query.rate && qb.andWhere('post.rate = :rate', { rate: query.rate });

      query.attractionId && qb.andWhere('post.attractionId = :attractionId', { attractionId: query.attractionId });

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
      
    return await qb.getManyAndCount();
  }

  async getAdvertisingPosts(query: GetPostsParamsDto): Promise<[Post[], number]> {
    const limit = query.limit / 5;
    const qb = this.createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.attraction', 'attraction')
      .where('attraction.advertisingPackageId IS NOT NULL')
      .orderBy('post.createdAt', 'DESC')
      .skip(query.offset)
      .take(limit);
      
    return await qb.getManyAndCount();
  }

  async getPosts(query: GetPostsParamsDto): Promise<[Post[], number]> {
    const normalPosts = await this.getNormalPosts(query);
    const advertisingPosts = await this.getAdvertisingPosts(query);
    const numOfAdvertisingPosts = advertisingPosts[0].length;
    const posts = [...normalPosts[0]];

    for (let i = 1; i <= numOfAdvertisingPosts; i++) {
      posts.splice((i * 5) - 1, 0, advertisingPosts[0][i-1]);
    }

    return [posts, normalPosts[1] + advertisingPosts[1]];
  }
}
