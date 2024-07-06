import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpStatus,
  Post,
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
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UpsertFavoriteInput } from '../dtos/favorite-upsert-input.dto';
import { FavoriteService } from '../services/favorite.service';

@ApiTags('favorites')
@Controller('favorites')
export class FavoriteController {
  constructor(
    private readonly favoriteService: FavoriteService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(FavoriteController.name);
  }

  @Post()
  @ApiOperation({
    summary: 'Upsert favorite API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(ResponseMessageBase),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async upsertFavorite(
    @ReqContext() ctx: RequestContext,
    @Body() input: UpsertFavoriteInput,
  ): Promise<BaseApiResponse<ResponseMessageBase>> {
    const favorite = await this.favoriteService.upsertFavorite(ctx, input);
    return { data: favorite, meta: {} };
  }
}
