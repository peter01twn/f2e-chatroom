import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInfoService, UserInfo } from '../user-info/user-info.service';
import { WebsocketService, SocketObserver } from '../websocket/websocket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatMessageService {
  private socket: SocketObserver;
  private userInfo?: UserInfo = { id: '', avatar: '', name: '' };

  constructor(websocket: WebsocketService, user: UserInfoService) {
    user.get$.subscribe(info => (this.userInfo = info));
    this.socket = websocket.connect('http://localhost:3000/echo', {
      reconnection: true,
      reconnectionDelay: 2500,
      reconnectionAttempts: 2,
    });
    this.socket.on('connect_error').subscribe(err => console.log(err));
  }

  recive(e: string): Observable<any> {
    return this.socket.on<any>(e);
  }

  send(msg: string): void {
    this.socket.send({ owner: this.userInfo?.id, msg });
  }

  broadcast(msg: string): void {
    this.socket.emit('broadcast', { owner: this.userInfo?.id, msg });
  }
}
