import { Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { Favorite } from '../../../db/entities/favorite.entity';
import { FavoriteRepository } from '../../../db/repositories/favorite.repository';
import { ResponseMessageBase } from '../../common/base/returnBase';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UpsertFavoriteInput } from '../dtos/favorite-upsert-input.dto';
import { FavoriteAclService } from './favorite-acl.service';

@Injectable()
export class FavoriteService {
  constructor(
    private repository: FavoriteRepository,
    private aclService: FavoriteAclService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(FavoriteService.name);
  }
  async upsertFavorite(
    ctx: RequestContext,
    input: UpsertFavoriteInput,
  ): Promise<ResponseMessageBase> {
    this.logger.log(ctx, `${this.upsertFavorite.name} was called`);

    const actor: Actor = ctx.user!;
    input.userId = actor.id;

    const favorite = plainToClass(Favorite, input);

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Update, favorite);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    const favoriteSaved = await this.repository.getFavoritesByPostIdAndUserId(
      favorite.userId,
      favorite.postId,
    );

    if (input.isFavorite) {
      if (favoriteSaved) {
        return {
          message: 'Favorite already exists',
          success: false,
        };
      }

      this.logger.log(ctx, `calling ${FavoriteRepository.name}.saveFavorite`);
      await this.repository.saveFavorite(favorite.userId, favorite.postId);

      return {
        message: 'Favorite created',
        success: true,
      };
    } else {
      if (!favoriteSaved) {
        return {
          message: 'Favorite not found',
          success: false,
        };
      }

      this.logger.log(ctx, `calling ${FavoriteRepository.name}.delete`);
      await this.repository.delete({
        userId: favorite.userId,
        postId: favorite.postId,
      });

      return {
        message: 'Favorite deleted',
        success: true,
      };
    }
  }
}
