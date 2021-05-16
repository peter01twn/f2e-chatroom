import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat/chat.service';

@Injectable({ providedIn: 'root' })
export class CanEnterChatRoomGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.chat.isLogin) {
      return true;
    } else {
      return this.router.createUrlTree(['login']);
    }
  }

  constructor(private chat: ChatService, private router: Router) {}
}
