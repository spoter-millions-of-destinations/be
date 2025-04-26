import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';

export class GetCollectionsParamsDto extends PaginationParamsDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  postId?: number;
}

export class GetCollectionsOfUserParamDto extends PaginationParamsDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  userId: number;
}
