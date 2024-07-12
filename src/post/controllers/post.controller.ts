import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
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
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { GetPostsParamsDto } from '../dtos/get-posts-input.dto';
import { CreatePostInput } from '../dtos/post-input.dto';
import { PostOutput } from '../dtos/post-output.dto';
import { PostService } from '../services/post.service';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(PostController.name);
  }

  @Post()
  @ApiOperation({
    summary: 'Create post API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(PostOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createPost(
    @ReqContext() ctx: RequestContext,
    @Body() input: CreatePostInput,
  ): Promise<BaseApiResponse<PostOutput>> {
    const post = await this.postService.createPost(ctx, input);
    return { data: post, meta: {} };
  }

  @Get()
  @ApiOperation({
    summary: 'Get posts as a list API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([PostOutput]),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getPosts(
    @ReqContext() ctx: RequestContext,
    @Query() query: GetPostsParamsDto,
  ): Promise<BaseApiResponse<PostOutput[]>> {
    this.logger.log(ctx, `${this.getPosts.name} was called`);

    const { posts, count } = await this.postService.getPosts(
      ctx,
      query
    );

    return { data: posts, meta: { count } };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get post by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(PostOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPost(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
  ): Promise<BaseApiResponse<PostOutput>> {
    this.logger.log(ctx, `${this.getPost.name} was called`);

    const post = await this.postService.getPostById(ctx, id);
    return { data: post, meta: {} };
  }

  // @Patch(':id')
  // @ApiOperation({
  //   summary: 'Update post API',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: SwaggerBaseApiResponse(PostOutput),
  // })
  // @UseInterceptors(ClassSerializerInterceptor)
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // async updatePost(
  //   @ReqContext() ctx: RequestContext,
  //   @Param('id') postId: number,
  //   @Body() input: UpdatePostInput,
  // ): Promise<BaseApiResponse<PostOutput>> {
  //   const post = await this.postService.updatePost(ctx, postId, input);
  //   return { data: post, meta: {} };
  // }

  // @Delete(':id')
  // @ApiOperation({
  //   summary: 'Delete post by id API',
  // })
  // @ApiResponse({
  //   status: HttpStatus.NO_CONTENT,
  // })
  // @UseInterceptors(ClassSerializerInterceptor)
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // async deletePost(
  //   @ReqContext() ctx: RequestContext,
  //   @Param('id') id: number,
  // ): Promise<void> {
  //   this.logger.log(ctx, `${this.deletePost.name} was called`);

  //   return this.postService.deletePost(ctx, id);
  // }
}
