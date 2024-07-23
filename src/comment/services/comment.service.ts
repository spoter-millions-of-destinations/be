import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { Comment } from '../../../db/entities/comment.entity';
import { User } from '../../../db/entities/user.entity';
import { CommentRepository } from '../../../db/repositories/comment.repository';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UserService } from '../../user/services/user.service';
import { CreateCommentInput } from '../dtos/comment-input.dto';
import { CommentOutput } from '../dtos/comment-output.dto';
import { GetCommentsParamsDto } from '../dtos/get-comments-input.dto';
import { CommentAclService } from './comment-acl.service';

@Injectable()
export class CommentService {
  constructor(
    private repository: CommentRepository,
    private aclService: CommentAclService,
    private userService: UserService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(CommentService.name);
  }

  async createComment(
    ctx: RequestContext,
    input: CreateCommentInput,
  ): Promise<CommentOutput> {
    this.logger.log(ctx, `${this.createComment.name} was called`);
    console.log('input', input);

    const comment = plainToClass(Comment, input);

    const actor: Actor = ctx.user!;
    const user = await this.userService.getUserById(ctx, actor.id);

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Create, comment);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    comment.user = plainToClass(User, user);

    this.logger.log(ctx, `calling ${CommentRepository.name}.save`);
    const savedComment = await this.repository.save(comment);

    return plainToClass(CommentOutput, savedComment, {
      excludeExtraneousValues: true,
    });
  }

  async getComments(
    ctx: RequestContext,
    query: GetCommentsParamsDto,
  ): Promise<{ comments: CommentOutput[]; count: number }> {
    this.logger.log(ctx, `${this.getComments.name} was called`);
    const { limit, offset, postId } = query;

    const actor: Actor = ctx.user!;

    const isAllowed = this.aclService.forActor(actor).canDoAction(Action.List);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    this.logger.log(ctx, `calling ${CommentRepository.name}.find`);
    const [comments, count] = await this.repository.findAndCount({
      where: { postId },
      take: limit,
      skip: offset,
      relations: ['user'],
    });

    const commentsOutput = plainToClass(CommentOutput, comments, {
      excludeExtraneousValues: true,
    });

    return { comments: commentsOutput, count };
  }
}
