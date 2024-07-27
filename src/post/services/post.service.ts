import { Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

// import * as _ from 'lodash';
// import { Attraction } from '../../../db/entities/attraction.entity';
// import { Collection } from '../../../db/entities/collection.entity';
// import { CollectionItem } from '../../../db/entities/collectionItem.entity';
// import { Comment } from '../../../db/entities/comment.entity';
import { Post } from '../../../db/entities/post.entity';
import { User } from '../../../db/entities/user.entity';
import { AttractionRepository } from '../../../db/repositories/attraction.repository';
import { FavoriteRepository } from '../../../db/repositories/favorite.repository';
import { PostRepository } from '../../../db/repositories/post.repository';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UserService } from '../../user/services/user.service';
import {
  getPlaceFromCoordinates,
  getPlaceFromSearchText,
  MapboxResponse,
} from '../../utils/getPlaceFromCoordinates';
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
    private attractionRepository: AttractionRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(PostService.name);
  }

  async createPost(
    ctx: RequestContext,
    input: CreatePostInput,
  ): Promise<PostOutput> {
    this.logger.log(ctx, `${this.createPost.name} was called`);

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

    if (input.advertisingPackageId && input.address) {
      const attraction: MapboxResponse = await getPlaceFromSearchText(
        input.address,
      );

      post.attraction = await this.attractionRepository.createAttraction({
        ...attraction,
        name: input.address,
        advertisingPackageId: input.advertisingPackageId,
      });
      post.longitude = attraction.longitude;
      post.latitude = attraction.latitude;
    } else {
      const attraction: MapboxResponse = await getPlaceFromCoordinates({
        longitude: post.longitude,
        latitude: post.latitude,
      });

      const attractionEntity =
        await this.attractionRepository.getAttractionByPlace(attraction);

      if (attractionEntity) {
        post.attraction = attractionEntity;
      } else {
        post.attraction = await this.attractionRepository.createAttraction({
          ...attraction,
          name: attraction.placeName,
        });
      }
    }

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
    const posts: Partial<Post>[] = readExcelFile(filePath);
    posts.forEach((post) => {
      post.userId = users[Math.floor(Math.random() * users.length)].id;
    });
    // console.log('posts', posts);
    await this.repository.save(posts);
  }

  async crawlData1() {
    // const users = await User.find();
    // const userIds = users.map((user) => user.id);
    // const attractionEntities = await Attraction.find();
    // const postEntities = await Post.find();
    // const filePath = 'data/data1.xlsx';
    // const { attractions, posts, collections, comments } =
    //   readDataFromExcelFile(filePath);
    // const attractionEntities: any[] = []
    // attractions.forEach(async (attraction) => {
    //   // const attractionData: MapboxResponse = await getPlaceFromCoordinates({
    //   //   longitude: attraction?.longitude as number,
    //   //   latitude: attraction?.latitude as number,
    //   // });
    //   const attractionEntity = { ...attraction };
    //   attractionEntities.push(attractionEntity);
    //   // await Attraction.create(attractionEntity).save();
    // });
    // posts.slice(0,13).forEach((post: any) => {
    //   post.userId = userIds[Math.floor(Math.random() * userIds.length)];
    //   const attraction = attractions.find(
    //     (attraction) => attraction?.order === post?.attractionOrder,
    //   );
    //   const attractionData = attractionEntities.find(
    //     (attractionEntity) => attractionEntity?.name === attraction?.name,
    //   );
    //   post.attraction = attractionData;
    //   console.log('post', _.omit(post, ['order', 'attractionOrder']));
    //   Post.create(_.omit(post, ['order', 'attractionOrder'])).save();
    // });
    // collections.forEach(async (collection: any) => {
    //   collection.userId = 22;
    //   const collectionEntity: Collection = await Collection.create(_.omit(collection, ['postOrders'])).save();
    //   const postOrders = collection.postOrders.split(',').map(Number);
    //   const postDatas = postOrders.map((postOrder: number) => {
    //     return posts.find((post) => post?.order === postOrder);
    //   })
    //   const collectionItems: Partial<CollectionItem>[] = [];
    //   postDatas.forEach( (postData: any) => {
    //     const postId = postEntities.find((postEntity) => postEntity?.description === postData?.description)?.id ?? 0;
    //     const collectionItem = {
    //       collectionId: collectionEntity.id,
    //       postId,
    //     };
    //     collectionItems.push(collectionItem);
    //   })
    //   await CollectionItem.save(collectionItems);
    // });
    // comments.forEach(async (comment: any) => {
    //   const post = posts.find((post) => post?.order === comment?.postOrder);
    //   const postId = postEntities.find(
    //     (postEntity) => postEntity?.description === post?.description,
    //   )?.id ?? 0;
    //   const commentData: Partial<Comment> = {
    //     postId,
    //     content: comment?.content as string,
    //   };
    //   console.log('comment', commentData);
    //   await Comment.save(commentData);
    // });
  }
}
