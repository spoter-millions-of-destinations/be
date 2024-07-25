import { Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { AttractionRepository } from '../../../db/repositories/attraction.repository';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { AttractionOutput } from '../dtos/attraction-output.dto';
import { AttractionAclService } from './attraction-acl.service';

@Injectable()
export class AttractionService {
  constructor(
    private repository: AttractionRepository,
    private aclService: AttractionAclService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AttractionService.name);
  }

  async getAttractions(
    ctx: RequestContext,
    query: PaginationParamsDto,
  ): Promise<{ attractions: AttractionOutput[]; count: number }> {
    this.logger.log(ctx, `${this.getAttractions.name} was called`);
    const { limit, offset } = query;

    const actor: Actor = ctx.user!;

    const isAllowed = this.aclService.forActor(actor).canDoAction(Action.List);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    this.logger.log(ctx, `calling ${AttractionRepository.name}.find`);
    const [attractions, count] = await this.repository.findAndCount({
      where: {},
      take: limit,
      skip: offset,
    });

    const attractionsOutput = plainToClass(AttractionOutput, attractions, {
      excludeExtraneousValues: true,
    });

    return { attractions: attractionsOutput, count };
  }
}
