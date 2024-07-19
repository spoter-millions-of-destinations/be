import { Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

// import { Like } from 'typeorm';
import { Post } from '../../../db/entities/post.entity';
import { User } from '../../../db/entities/user.entity';
import { FavoriteRepository } from '../../../db/repositories/favorite.repository';
import { PostRepository } from '../../../db/repositories/post.repository';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UserService } from '../../user/services/user.service';
// import { crawlData } from '../../utils/crawlData';
import { GetPostsParamsDto } from '../dtos/get-posts-input.dto';
import { CreatePostInput, UpdatePostInput } from '../dtos/post-input.dto';
import { PostOutput } from '../dtos/post-output.dto';
import { PostAclService } from './post-acl.service';
import { readExcelFile } from './uploadDataFromExcel';

@Injectable()
export class PostService {
  constructor(
    private repository: PostRepository,
    private favoriteRepository: FavoriteRepository,
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
    query: GetPostsParamsDto,
  ): Promise<{ posts: PostOutput[]; count: number }> {
    this.logger.log(ctx, `${this.getPosts.name} was called`);

    // const { search, limit, offset, longitude, latitude } = query;

    const actor: Actor = ctx.user!;

    const isAllowed = this.aclService.forActor(actor).canDoAction(Action.List);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    this.logger.log(ctx, `calling ${PostRepository.name}.findAndCount`);
    const [posts, count] = await this.repository.getPosts(query);

    const favorites = await this.favoriteRepository.getFavoritesByUserId(
      actor.id,
    );

    posts.forEach((post) => {
      post.isFavorite = !!favorites.find((f) => f.postId === post.id);
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

    post.isFavorite = await this.favoriteRepository.checkFavorite(
      actor.id,
      post.id,
    );
    console.log('post', post);

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

  async crawlData() {
    const users = await User.find();
    const filePath = 'data/maps-results2.xlsx';
    const posts: Partial<Post>[] = readExcelFile(filePath)
    posts.forEach((post) => {
      post.userId = users[Math.floor(Math.random() * users.length)].id;
    })
    // console.log('posts', posts);
    await this.repository.save(posts);
  }
}
