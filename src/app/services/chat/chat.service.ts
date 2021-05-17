import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ChatMessage } from 'src/app/core/entities/message';
import { UserInfoService, UserInfo } from '../user-info/user-info.service';
import { WebsocketService, SocketObserver } from '../websocket/websocket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  isLogin = false;

  readonly socket: SocketObserver;
  private userInfo: UserInfo = { id: '', avatar: '', name: '' };

  message$: Observable<ChatMessage>;

  // tslint:disable-next-line: variable-name
  private _userList$ = new BehaviorSubject<UserInfo[]>([]);

  userList$ = this._userList$.asObservable();

  constructor(websocket: WebsocketService, private user: UserInfoService) {
    this.socket = websocket.connect('http://localhost:3000/chat', {
      reconnection: true,
      reconnectionDelay: 2500,
      autoConnect: false,
    });

    this.socket.on('connect').subscribe(() => this.connected());
    this.socket.on('disconnect').subscribe(() => this.disconnect());
    this.message$ = this.socket.on('message');

    this.socket.on<UserInfo[]>('user_list').subscribe(userList => this._userList$.next(userList));

    this.user.get$.subscribe(info => {
      this.userInfo = info;
    });
  }

  join$(): Observable<boolean> {
    this.socket.connect();

    const res = new Subject<boolean>();
    const { avatar, name } = this.userInfo;
    this.socket.emit('join', { avatar, name }, ({ success }: { success: boolean }) => {
      res.next(success);
    });

    return res.asObservable();
  }

  send(msg: string): void {
    this.socket.send({ content: msg });
  }

  getRecords(): Observable<ChatMessage[]> {
    const subject = new Subject<ChatMessage[]>();
    this.socket.emit('get_records', ({ messages }: { messages: ChatMessage[] }) => subject.next(messages));
    return subject.asObservable().pipe(take(1));
  }

  private connected(): void {
    this.isLogin = true;
  }

  private disconnect(): void {
    this.isLogin = false;
  }
}
