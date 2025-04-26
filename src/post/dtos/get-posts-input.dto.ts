import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';

export class GetPostsParamsDto extends PaginationParamsDto {
  @ApiPropertyOptional({
    description: 'Optional',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  userId?: number;

  @ApiPropertyOptional({
    description: 'Optional',
    type: String,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  attractionId?: number;

  @ApiPropertyOptional({
    description: 'Optional',
    type: String,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Optional',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Optional',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Optional',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  radius?: number;

  @ApiPropertyOptional({
    description: 'Optional',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  rate?: number;
}
