import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInfoService, UserInfo } from '../user-info/user-info.service';
import { WebsocketService, SocketWrapper } from '../websocket/websocket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatMessageService {
  recive$: Observable<unknown>;

  private socket: SocketWrapper;
  private userInfo?: UserInfo = { id: '', avatar: '', name: '' };

  constructor(websocket: WebsocketService, user: UserInfoService) {
    user.get$.subscribe(info => (this.userInfo = info));
    this.socket = websocket.connect('http://localhost:3000/echo');
    this.socket.error$.subscribe(err => this.socket.disconnect());
    this.recive$ = this.socket.on<any>('message');
  }

  send(msg: string): void {
    this.socket.send({ owner: this.userInfo?.id, msg });
  }
}
