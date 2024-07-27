import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CheckoutOutput {
  @Expose()
  @ApiProperty()
  checkoutUrl: string;

  @Expose()
  @ApiProperty()
  successUrl: string;

  @Expose()
  @ApiProperty()
  cancelUrl: string;
}
