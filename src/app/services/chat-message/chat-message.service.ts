import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebsocketService } from '../websocket/websocket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatMessageService {
  recive$: Observable<unknown>;

  private wsSubject: Subject<unknown>;

  constructor(websocket: WebsocketService) {
    this.wsSubject = websocket.connect('ws://localhost:3000/echo');
    this.recive$ = this.wsSubject.asObservable();
  }

  send(msg: string): void {
    this.wsSubject.next({ action: 'add', msg });
  }
}
