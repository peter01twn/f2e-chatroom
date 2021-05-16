import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserInfoService, UserInfo } from '../user-info/user-info.service';
import { WebsocketService, SocketObserver } from '../websocket/websocket.service';

export interface Message {
  owner: string;
  msg: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  isLogin = false;

  private socket: SocketObserver;
  private userInfo: UserInfo = { id: '', avatar: '', name: '' };

  message$: Observable<Message>;

  private _userList$ = new BehaviorSubject<UserInfo[]>([]);

  userList$ = this._userList$.asObservable();

  constructor(websocket: WebsocketService, private user: UserInfoService) {
    this.socket = websocket.connect('http://localhost:3000/chat', {
      reconnection: true,
      reconnectionDelay: 2500,
      reconnectionAttempts: 2,
    });

    this.socket.on('connect').subscribe(() => this.connect());
    this.socket.on('disconnect').subscribe(() => this.disconnect());
    this.message$ = this.socket.on('message');

    this.socket
      .on<UserInfo[]>('user_list')
      .pipe(map(users => users.filter(({ id }) => id !== this.socket.id)))
      .subscribe(userList => this._userList$.next(userList));
  }

  join$(): Observable<boolean> {
    const res = new Subject<boolean>();
    this.socket.emit('join', this.userInfo, ({ success }: { success: boolean }) => {
      this.isLogin = success;
      res.next(success);
    });

    return res.asObservable();
  }

  send(msg: string): void {
    this.socket.send({ owner: this.userInfo?.id, msg });
  }

  privateMsg(userId: string, msg: string): void {
    this.socket.emit('private_message', { userId, msg: { owner: this.userInfo.id, msg } });
  }

  private connect(): void {
    this.user.update({ id: this.socket.id });
    this.user.get$.subscribe(info => {
      this.userInfo = info;
    });
  }

  private disconnect(): void {
    this.isLogin = false;
  }
}
