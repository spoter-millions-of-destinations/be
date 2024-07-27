import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LineItem {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  productName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  image: string;
}

export class CreateCheckoutSessionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  successUrl: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cancelUrl: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  advertisingPackageId: number;
}
