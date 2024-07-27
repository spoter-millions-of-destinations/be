import { Body,ClassSerializerInterceptor,Controller, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SwaggerBaseApiResponse } from '../../shared/dtos/base-api-response.dto';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { CheckoutOutput } from '../dtos/checkout-output.dto';
import { CreateCheckoutSessionDto } from '../dtos/create-checkout-session.dto';
import { StripeService } from '../services/stripe.service';

@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @ApiOperation({
    summary: 'Create checkout session API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(CheckoutOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('checkout-session')
  async createCheckoutSession(@ReqContext() ctx: RequestContext, @Body() query: CreateCheckoutSessionDto) {
    const { successUrl, cancelUrl, advertisingPackageId } = query;
    const result = await this.stripeService.createCheckoutSession(ctx, successUrl, cancelUrl, advertisingPackageId);

    return {
      success: true,
      data: {
        checkoutUrl: result.url,
        successUrl,
        cancelUrl,
      },
    };
  }
}
