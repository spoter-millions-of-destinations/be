import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
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
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { AttractionOutput } from '../dtos/attraction-output.dto';
import { AttractionService } from '../services/attraction.service';

@ApiTags('attractions')
@Controller('attractions')
export class AttractionController {
  constructor(
    private readonly attractionService: AttractionService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AttractionController.name);
  }

  @Get()
  @ApiOperation({
    summary: 'Get attractions as a list API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([AttractionOutput]),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAttractions(
    @ReqContext() ctx: RequestContext,
    @Query() query: PaginationParamsDto,
  ): Promise<BaseApiResponse<AttractionOutput[]>> {
    this.logger.log(ctx, `${this.getAttractions.name} was called`);

    const { attractions, count } = await this.attractionService.getAttractions(
      ctx,
      query,
    );

    return { data: attractions, meta: { count } };
  }
}
