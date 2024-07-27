import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

import { AdvertisingPackage } from '../../../db/entities/advertisingPackage.entity';
import { User } from '../../../db/entities/user.entity';
import { Actor } from '../../shared/acl/actor.constant';
import { RequestContext } from '../../shared/request-context/request-context.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
      apiVersion: '2024-06-20',
      typescript: true,
    });
  }

  async createCheckoutSession(
    ctx: RequestContext,
    successUrl: string,
    cancelUrl: string,
    advertisingPackageId: number,
  ) {
    const actor: Actor = ctx.user!;
    const user = await User.createQueryBuilder('user')
      .where('user.id = :id', { id: actor.id })
      .getOne();

    const advertisingPackage = await AdvertisingPackage.createQueryBuilder(
      'advertisingPackage',
    )
      .where('advertisingPackage.id = :id', { id: advertisingPackageId })
      .getOne();
      

    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user?.email,
      line_items: [
        {
          price_data: {
            currency: 'vnd',
            product_data: {
              name: advertisingPackage?.name ?? 'Product',
              images: [advertisingPackage?.image ?? ''],
              description: advertisingPackage?.description ?? 'Description',
            },
            unit_amount: advertisingPackage?.price ?? 0,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  }
}
