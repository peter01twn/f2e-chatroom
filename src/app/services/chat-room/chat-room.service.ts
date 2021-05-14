import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketObserver, WebsocketService } from '../websocket/websocket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomService {
  private socket: SocketObserver;

  constructor(private websocket: WebsocketService) {
    this.socket = this.websocket.connect('http://localhost:3000/user-room', {
      reconnection: true,
      reconnectionDelay: 2500,
      reconnectionAttempts: 2,
    });
    this.socket.on('connect_error').subscribe(err => console.log(err));
  }

  watch$(): Observable<string[]> {
    this.socket.emit('watch');
    return this.socket.on<string[]>('watch');
  }

  enter(channel: string): void {
    this.socket.emit('enter', channel);
  }

  leave(channel: string): void {
    this.socket.emit('leave', channel);
  }
}
