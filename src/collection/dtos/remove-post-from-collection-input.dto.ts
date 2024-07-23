import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';


export class RemovePostFromCollectionsInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  collectionId: number;
}
