import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UserInfoService, UserInfo } from '../user-info/user-info.service';
import { WebsocketService } from '../websocket/websocket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatMessageService {
  recive$: Observable<unknown>;

  private wsSubject: Subject<unknown>;
  private userInfo?: UserInfo = { id: '', avatar: '', name: '' };

  constructor(websocket: WebsocketService, private user: UserInfoService) {
    this.wsSubject = websocket.connect('ws://localhost:3000/echo');
    this.recive$ = this.wsSubject.asObservable();
    user.get$.subscribe(info => (this.userInfo = info));
  }

  send(msg: string): void {
    this.wsSubject.next({ action: 'new', owner: this.userInfo?.id, msg });
  }
}
