import { Injectable } from '@nestjs/common';

import { ROLE } from '../../auth/constants/role.constant';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';
// import { Actor } from '../../shared/acl/actor.constant';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostAclService extends BaseAclService<Post> {
  constructor() {
    super();
    this.canDo(ROLE.ADMIN, [Action.Manage]);
    this.canDo(ROLE.USER, [Action.Create, Action.List, Action.Read]);
    // this.canDo(ROLE.USER, [Action.Update, Action.Delete], this.isArticleAuthor);
  }

  // isArticleAuthor(article: Article, user: Actor): boolean {
  //   // return article.author.id === user.id;
  // }
}
