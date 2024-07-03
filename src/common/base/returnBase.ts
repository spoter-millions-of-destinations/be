import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseMessageBase {
  @Expose()
  @ApiProperty()
  success: boolean;

  @Expose()
  @ApiProperty()
  message: string;
}
