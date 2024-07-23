import { Injectable } from '@nestjs/common';

import { Comment } from '../../../db/entities/comment.entity';
import { ROLE } from '../../auth/constants/role.constant';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';
// import { Actor } from '../../shared/acl/actor.constant';

@Injectable()
export class CommentAclService extends BaseAclService<Comment> {
  constructor() {
    super();
    // Admin can do all action
    this.canDo(ROLE.ADMIN, [Action.Manage]);
    //user can read himself or any other user
    this.canDo(ROLE.USER, [Action.Update, Action.Create, Action.List, Action.Read]);
    // user can only update himself
    // this.canDo(ROLE.USER, [Action.Update, Action.Create], this.isUserItself);
  }

  // isUserItself(resource: Comment, actor: Actor): boolean {
  //   return resource.userId === actor.id;
  // }
}
