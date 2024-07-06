import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';


export class UpsertFavoriteInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isFavorite: boolean;

  userId: number;
}
