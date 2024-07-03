import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

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
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @Type(() => UserOutput)
  @ApiProperty()
  user: UserOutput;
}
