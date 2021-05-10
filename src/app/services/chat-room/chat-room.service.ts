import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketObserver, WebsocketService } from '../websocket/websocket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomService {
  private socket: SocketObserver;

  getRooms$: Observable<string[]>;

  enter$: Observable<string>;

  leave$: Observable<string>;

  constructor(private websocket: WebsocketService) {
    this.socket = this.websocket.connect('ws://localhost:3000/chat-room', {
      reconnection: true,
      reconnectionDelay: 2500,
      reconnectionAttempts: 2,
    });

    this.getRooms$ = this.socket.on('getRooms');

    this.enter$ = this.socket.on('enter');

    this.leave$ = this.socket.on('leave');
  }

  enter(channel: string): void {
    this.socket.emit('enter', channel);
  }

  leave(channel: string): void {
    this.socket.emit('leave', channel);
  }
}
