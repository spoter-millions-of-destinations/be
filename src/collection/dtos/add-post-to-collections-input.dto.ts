import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';


export class AddPostToCollectionsInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  collectionIds: number[];
}

export class AddPostToDefaultCollectionInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  postId: number;
}
