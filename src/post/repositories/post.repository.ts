import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Post } from '../entities/post.entity';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(private dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Post> {
    const post = await this.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }
}
