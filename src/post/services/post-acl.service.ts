import { Injectable } from '@nestjs/common';

import { Post } from '../../../db/entities/post.entity';
import { ROLE } from '../../auth/constants/role.constant';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';
// import { Actor } from '../../shared/acl/actor.constant';

@Injectable()
export class PostAclService extends BaseAclService<Post> {
  constructor() {
    super();
    this.canDo(ROLE.ADMIN, [Action.Manage]);
    this.canDo(ROLE.USER, [Action.Create, Action.List, Action.Read]);
    // this.canDo(ROLE.USER, [Action.Update, Action.Delete], this.isPostAuthor);
  }

  // isPostAuthor(post: Post, user: Actor): boolean {
  //   return post.user.id === user.id;
  // }
}
