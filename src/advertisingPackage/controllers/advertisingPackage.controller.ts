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
import { AdvertisingPackageOutput } from '../dtos/advertisingPackage-output.dto';
import { AdvertisingPackageService } from '../services/advertisingPackage.service';

@ApiTags('advertisingPackages')
@Controller('advertisingPackages')
export class AdvertisingPackageController {
  constructor(
    private readonly advertisingPackageService: AdvertisingPackageService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AdvertisingPackageController.name);
  }

  @ApiOperation({
    summary: 'Get all advertising packages',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([AdvertisingPackageOutput]),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAdvertisingPackages(
    @ReqContext() ctx: RequestContext,
    @Query() query: PaginationParamsDto,
  ): Promise<BaseApiResponse<AdvertisingPackageOutput[]>> {
    this.logger.log(ctx, `${this.getAdvertisingPackages.name} was called`);
    const result = await this.advertisingPackageService.getAdvertisingPackages(
      ctx,
      query,
    );
    return { data: result.advertisingPackages, meta: {} };
  }
}
