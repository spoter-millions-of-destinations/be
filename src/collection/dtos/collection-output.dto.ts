import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { PostOutput } from '../../post/dtos/post-output.dto';
import { UserOutput } from '../../post/dtos/user-output.dto';

export class CollectionOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  image: string;

  @Expose()
  @ApiProperty()
  name: string;

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
  @Type(() => CollectionItemOutput)
  @ApiProperty()
  collectionItems: CollectionItemOutput[];

  @Expose()
  @ApiProperty()
  isAdded: boolean;
}

export class CollectionItemOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @Type(() => PostOutput)
  @ApiProperty()
  post: PostOutput;
}
