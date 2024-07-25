import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { AttractionOutput } from '../../attraction/dtos/attraction-output.dto';
import { UserOutput } from './user-output.dto';

export class PostOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  images: string[];

  @Expose()
  @ApiProperty()
  longitude: number;

  @Expose()
  @ApiProperty()
  latitude: number;

  @Expose()
  @ApiProperty()
  isFavorite: boolean;

  @Expose()
  @ApiProperty()
  rate: number;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @Type(() => UserOutput)
  @ApiProperty()
  user: UserOutput;

  @Expose()
  @ApiProperty()
  @Type(() => AttractionOutput)
  attraction: AttractionOutput;
}
