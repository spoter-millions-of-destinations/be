import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';

export class GetCommentsParamsDto extends PaginationParamsDto {
  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  postId: number;
}
