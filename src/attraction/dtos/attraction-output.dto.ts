import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AttractionOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  rate: number;

  @Expose()
  @ApiProperty()
  placeName: string;

  @Expose()
  @ApiProperty()
  address: string;

  @Expose()
  @ApiProperty()
  ward: string;

  @Expose()
  @ApiProperty()
  district: string;

  @Expose()
  @ApiProperty()
  city: string;

  @Expose()
  @ApiProperty()
  country: string;

  @Expose()
  @ApiProperty()
  longitude: number;

  @Expose()
  @ApiProperty()
  latitude: number;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
