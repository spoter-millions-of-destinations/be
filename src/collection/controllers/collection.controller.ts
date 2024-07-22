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
import { ResponseMessageBase } from '../../common/base/returnBase';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { AddPostToCollectionsInput } from '../dtos/add-post-to-collections-input.dto';
import { CreateCollectionInput } from '../dtos/collection-input.dto';
import { CollectionOutput } from '../dtos/collection-output.dto';
import { CollectionService } from '../services/collection.service';

@ApiTags('collections')
@Controller('collections')
export class CollectionController {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(CollectionController.name);
  }

  @Post()
  @ApiOperation({
    summary: 'Create collection API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(CollectionOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createCollection(
    @ReqContext() ctx: RequestContext,
    @Body() input: CreateCollectionInput,
  ): Promise<BaseApiResponse<CollectionOutput>> {
    const collection = await this.collectionService.createCollection(
      ctx,
      input,
    );
    return { data: collection, meta: {} };
  }

  @Get()
  @ApiOperation({
    summary: 'Get collections as a list API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([CollectionOutput]),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getCollections(
    @ReqContext() ctx: RequestContext,
    @Query() query: PaginationParamsDto,
  ): Promise<BaseApiResponse<CollectionOutput[]>> {
    this.logger.log(ctx, `${this.getCollections.name} was called`);

    const { collections, count } = await this.collectionService.getCollections(
      ctx,
      query,
    );

    return { data: collections, meta: { count } };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get collection by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(CollectionOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getCollection(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
  ): Promise<BaseApiResponse<CollectionOutput>> {
    this.logger.log(ctx, `${this.getCollection.name} was called`);

    const collection = await this.collectionService.getCollectionById(ctx, id);
    return { data: collection, meta: {} };
  }

  @Post('items')
  @ApiOperation({
    summary: 'Add post to collections API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(ResponseMessageBase),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async addPostsToCollection(
    @ReqContext() ctx: RequestContext,
    @Body() query: AddPostToCollectionsInput,
  ): Promise<BaseApiResponse<ResponseMessageBase>> {
    this.logger.log(ctx, `${this.addPostsToCollection.name} was called`);

    const result = await this.collectionService.addPostsToCollection(ctx, query);
    
    return {
      data: result,
      meta: {},
    };
  }
}
