import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { CreateCommentInput } from '../dtos/comment-input.dto';
import { CommentOutput } from '../dtos/comment-output.dto';
import { GetCommentsParamsDto } from '../dtos/get-comments-input.dto';
import { CommentService } from '../services/comment.service';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(CommentController.name);
  }

  @Post()
  @ApiOperation({
    summary: 'Create comment API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(CommentOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createComment(
    @ReqContext() ctx: RequestContext,
    @Body() input: CreateCommentInput,
  ): Promise<BaseApiResponse<CommentOutput>> {
    const comment = await this.commentService.createComment(
      ctx,
      input,
    );
    return { data: comment, meta: {} };
  }

  @Get()
  @ApiOperation({
    summary: 'Get comments as a list API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([CommentOutput]),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getComments(
    @ReqContext() ctx: RequestContext,
    @Query() query: GetCommentsParamsDto,
  ): Promise<BaseApiResponse<CommentOutput[]>> {
    this.logger.log(ctx, `${this.getComments.name} was called`);

    const { comments, count } = await this.commentService.getComments(
      ctx,
      query,
    );

    return { data: comments, meta: { count } };
  }
}
