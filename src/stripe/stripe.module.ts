import { Module } from '@nestjs/common';

import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { SharedModule } from '../shared/shared.module';
import { StripeController } from './controllers/stripe.controller';
import { StripeService } from './services/stripe.service';

@Module({
  imports: [SharedModule],
  providers: [
    StripeService,
    JwtAuthStrategy
  ],
  controllers: [StripeController],
})
export class StripeModule {}
