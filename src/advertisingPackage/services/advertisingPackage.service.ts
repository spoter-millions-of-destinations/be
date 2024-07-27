import { Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { AdvertisingPackageRepository } from '../../../db/repositories/advertisingPackage.repository';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { AdvertisingPackageOutput } from '../dtos/advertisingPackage-output.dto';
import { AdvertisingPackageAclService } from './advertisingPackage-acl.service';

@Injectable()
export class AdvertisingPackageService {
  constructor(
    private repository: AdvertisingPackageRepository,
    private aclService: AdvertisingPackageAclService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AdvertisingPackageService.name);
  }

  async getAdvertisingPackages(
    ctx: RequestContext,
    query: PaginationParamsDto,
  ): Promise<{ advertisingPackages: AdvertisingPackageOutput[]; count: number }> {
    this.logger.log(ctx, `${this.getAdvertisingPackages.name} was called`);
    const { limit, offset } = query;

    const actor: Actor = ctx.user!;

    const isAllowed = this.aclService.forActor(actor).canDoAction(Action.Read);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    this.logger.log(ctx, `calling ${AdvertisingPackageRepository.name}.find`);
    const [advertisingPackages, count] = await this.repository.findAndCount({
      where: {},
      take: limit,
      skip: offset,
    });

    const advertisingPackagesOutput = plainToClass(AdvertisingPackageOutput, advertisingPackages, {
      excludeExtraneousValues: true,
    });

    return { advertisingPackages: advertisingPackagesOutput, count };
  }
}
