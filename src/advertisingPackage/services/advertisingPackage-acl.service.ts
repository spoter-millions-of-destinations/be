import { Injectable } from '@nestjs/common';

import { AdvertisingPackage } from '../../../db/entities/advertisingPackage.entity';
import { ROLE } from '../../auth/constants/role.constant';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';
// import { Actor } from '../../shared/acl/actor.constant';

@Injectable()
export class AdvertisingPackageAclService extends BaseAclService<AdvertisingPackage> {
  constructor() {
    super();
    // Admin can do all action
    this.canDo(ROLE.ADMIN, [Action.Manage]);
    //user can read himself or any other user
    this.canDo(ROLE.USER, [Action.Read]);
    // user can only update himself
    // this.canDo(ROLE.USER, [Action.Update, Action.Create], this.isUserItself);
  }

  // isUserItself(resource: AdvertisingPackage, actor: Actor): boolean {
  //   return resource.userId === actor.id;
  // }
}
