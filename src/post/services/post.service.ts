import { Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { Post } from '../../../db/entities/post.entity';
import { User } from '../../../db/entities/user.entity';
import { PostRepository } from '../../../db/repositories/post.repository';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UserService } from '../../user/services/user.service';
import { CreatePostInput, UpdatePostInput } from '../dtos/post-input.dto';
import { PostOutput } from '../dtos/post-output.dto';
import { PostAclService } from './post-acl.service';

@Injectable()
export class PostService {
  constructor(
    private repository: PostRepository,
    private userService: UserService,
    private aclService: PostAclService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(PostService.name);
  }

  async createPost(
    ctx: RequestContext,
    input: CreatePostInput,
  ): Promise<PostOutput> {
    this.logger.log(ctx, `${this.createPost.name} was called`);
    console.log('input', input);

    const post = plainToClass(Post, input);

    const actor: Actor = ctx.user!;
    console.log('post', post);
    const user = await this.userService.getUserById(ctx, actor.id);

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Create, post);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    post.user = plainToClass(User, user);

    this.logger.log(ctx, `calling ${PostRepository.name}.save`);
    const savedPost = await this.repository.save(post);

    return plainToClass(PostOutput, savedPost, {
      excludeExtraneousValues: true,
    });
  }

  async getPosts(
    ctx: RequestContext,
    limit: number,
    offset: number,
  ): Promise<{ posts: PostOutput[]; count: number }> {
    this.logger.log(ctx, `${this.getPosts.name} was called`);

    const actor: Actor = ctx.user!;

    const isAllowed = this.aclService.forActor(actor).canDoAction(Action.List);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    this.logger.log(ctx, `calling ${PostRepository.name}.findAndCount`);
    const [posts, count] = await this.repository.findAndCount({
      where: {},
      take: limit,
      skip: offset,
    });

    const postsOutput = plainToClass(PostOutput, posts, {
      excludeExtraneousValues: true,
    });

    return { posts: postsOutput, count };
  }

  async getPostById(ctx: RequestContext, id: number): Promise<PostOutput> {
    this.logger.log(ctx, `${this.getPostById.name} was called`);

    const actor: Actor = ctx.user!;

    this.logger.log(ctx, `calling ${PostRepository.name}.getById`);
    const post = await this.repository.getById(id);

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Read, post);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    return plainToClass(PostOutput, post, {
      excludeExtraneousValues: true,
    });
  }

  async updatePost(
    ctx: RequestContext,
    postId: number,
    input: UpdatePostInput,
  ): Promise<PostOutput> {
    this.logger.log(ctx, `${this.updatePost.name} was called`);

    this.logger.log(ctx, `calling ${PostRepository.name}.getById`);
    const post = await this.repository.getById(postId);

    const actor: Actor = ctx.user!;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Update, post);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    Object.assign(post, input);

    this.logger.log(ctx, `calling ${PostRepository.name}.save`);
    const savedPost = await this.repository.save(post);

    return plainToClass(PostOutput, savedPost, {
      excludeExtraneousValues: true,
    });
  }

  async deletePost(ctx: RequestContext, id: number): Promise<void> {
    this.logger.log(ctx, `${this.deletePost.name} was called`);

    this.logger.log(ctx, `calling ${PostRepository.name}.getById`);
    const post = await this.repository.getById(id);

    const actor: Actor = ctx.user!;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Delete, post);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    this.logger.log(ctx, `calling ${PostRepository.name}.remove`);
    await this.repository.remove(post);
  }
}
