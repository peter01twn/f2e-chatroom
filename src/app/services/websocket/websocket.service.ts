import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

export class SocketWrapper {
  private socket: Socket;

  connect$: Observable<undefined>;

  disconnnect$: Observable<undefined>;

  error$: Observable<Error>;

  constructor(uri: string, opts?: Partial<ManagerOptions & SocketOptions>) {
    this.socket = io(uri, opts);

    this.error$ = fromEvent(this.socket as any, 'connect_error');

    const connectSubject = new Subject<undefined>();
    const disconnnectSubject = new Subject<undefined>();
    this.connect$ = connectSubject.asObservable();
    this.disconnnect$ = connectSubject.asObservable();
    this.socket.on('connnect', () => connectSubject.next());
    this.socket.on('disconnnect', () => disconnnectSubject.next());
  }

  on<T>(e: string): Observable<T> {
    return fromEvent(this.socket as any, e);
  }

  send(...args: any[]): this {
    this.socket.send(...args);
    return this;
  }

  emit(e: string, ...args: any[]): this {
    this.socket.emit(e, ...args);
    return this;
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  connect(url: string): SocketWrapper {
    return this.createWs(url);
  }

  private createWs(url: string): SocketWrapper {
    const wrapper = new SocketWrapper(url);

    return wrapper;
  }
}
