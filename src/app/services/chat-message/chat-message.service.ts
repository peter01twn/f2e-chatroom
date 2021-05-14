import { Injectable } from '@angular/core';
import { userInfo } from 'node:os';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UserInfoService, UserInfo } from '../user-info/user-info.service';
import { WebsocketService, SocketObserver } from '../websocket/websocket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatMessageService {
  private socket: SocketObserver;
  private userInfo?: UserInfo = { id: '', avatar: '', name: '' };

  constructor(websocket: WebsocketService, user: UserInfoService) {
    this.socket = websocket.connect('http://localhost:3000/chat', {
      reconnection: true,
      reconnectionDelay: 2500,
      reconnectionAttempts: 2,
    });
    this.socket.on('connect_error').subscribe(err => console.log(err));

    user.get$.subscribe(info => {
      this.userInfo = info;
      this.socket.emit('join', userInfo);
    });
  }

  getUsers(): Observable<UserInfo[]> {
    return this.socket.on<UserInfo[]>('get_users').pipe(map(users => users.filter(({ id }) => id !== this.socket.id)));
  }

  send(msg: string): void {
    this.socket.send({ owner: this.userInfo?.id, msg });
  }

  broadcast(msg: string): void {
    this.socket.emit('broadcast', { owner: this.userInfo?.id, msg });
  }
}
