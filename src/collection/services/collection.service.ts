import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { In } from 'typeorm';

import { Collection } from '../../../db/entities/collection.entity';
import { User } from '../../../db/entities/user.entity';
import { CollectionRepository } from '../../../db/repositories/collection.repository';
import { CollectionItemRepository } from '../../../db/repositories/collectionItem.repository';
import { PostRepository } from '../../../db/repositories/post.repository';
import { ResponseMessageBase } from '../../common/base/returnBase';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UserService } from '../../user/services/user.service';
import { AddPostToCollectionsInput } from '../dtos/add-post-to-collections-input.dto';
import { CreateCollectionInput } from '../dtos/collection-input.dto';
import { CollectionOutput } from '../dtos/collection-output.dto';
import { CollectionAclService } from './collection-acl.service';

@Injectable()
export class CollectionService {
  constructor(
    private repository: CollectionRepository,
    private aclService: CollectionAclService,
    private userService: UserService,
    private collectionItemRepository: CollectionItemRepository,
    private postRepository: PostRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(CollectionService.name);
  }

  async createCollection(
    ctx: RequestContext,
    input: CreateCollectionInput,
  ): Promise<CollectionOutput> {
    this.logger.log(ctx, `${this.createCollection.name} was called`);
    console.log('input', input);

    const collection = plainToClass(Collection, input);

    const actor: Actor = ctx.user!;
    const user = await this.userService.getUserById(ctx, actor.id);


    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Create, collection);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    collection.user = plainToClass(User, user);

    this.logger.log(ctx, `calling ${CollectionRepository.name}.save`);
    const savedCollection = await this.repository.save(collection);

    return plainToClass(CollectionOutput, savedCollection, {
      excludeExtraneousValues: true,
    });
  }

  async getCollections(
    ctx: RequestContext,
    query: PaginationParamsDto,
  ): Promise<{ collections: CollectionOutput[]; count: number }> {
    this.logger.log(ctx, `${this.getCollections.name} was called`);
    const { limit, offset } = query;

    const actor: Actor = ctx.user!;

    const isAllowed = this.aclService.forActor(actor).canDoAction(Action.List);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    this.logger.log(ctx, `calling ${CollectionRepository.name}.find`);
    const [collections, count] = await this.repository.findAndCount({
      where: { userId: actor.id },
      take: limit,
      skip: offset,
      relations: ['user'],
    });

    const collectionsOutput = plainToClass(CollectionOutput, collections, {
      excludeExtraneousValues: true,
    });

    return { collections: collectionsOutput, count };
  }

  async getCollectionById(
    ctx: RequestContext,
    id: number,
  ): Promise<CollectionOutput> {
    this.logger.log(ctx, `${this.getCollectionById.name} was called`);

    const actor: Actor = ctx.user!;

    this.logger.log(ctx, `calling ${CollectionRepository.name}.getById`);
    const collection = await this.repository.getById(id);

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Read, collection);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    return plainToClass(CollectionOutput, collection, {
      excludeExtraneousValues: true,
    });
  }

  async addPostsToCollection(
    ctx: RequestContext,
    query: AddPostToCollectionsInput
  ): Promise<ResponseMessageBase> {
    this.logger.log(ctx, `${this.addPostsToCollection.name} was called`);
    const { postId, collectionIds } = query;

    const actor: Actor = ctx.user!;

    const collections = await this.repository.find({ where: { id: In(collectionIds) } });

    collections.forEach((collection) => {
      const isAllowed = this.aclService
        .forActor(actor)
        .canDoAction(Action.Update, collection);
      if (!isAllowed) {
        throw new UnauthorizedException();
      }
    });

    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const collectionItems = collections.map((collection) => {
      return {
        collectionId: collection.id,
        postId: post.id,
      };
    });

    const isPostInCollections = await this.collectionItemRepository.checkIfPostIsInCollections(
      postId,
      collectionIds,
    );

    if (isPostInCollections) {
      return { message: 'Post is already in one of the collections', success: false };
    }

    await this.collectionItemRepository.save(collectionItems);

    return { message: 'Post added to collection', success: true };
  }
}
