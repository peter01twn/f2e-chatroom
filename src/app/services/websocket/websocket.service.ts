import { Injectable, NgZone } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

export class SocketObserver {
  get id(): string {
    return this.socket.id;
  }

  readonly socket: Socket;

  constructor(uri: string, opts?: Partial<ManagerOptions & SocketOptions>) {
    this.socket = io(uri, opts);
    this.socket.on('connect_error', error => console.log(error));
  }

  on<T>(e: string): Observable<T> {
    return fromEvent(this.socket as any, e);
  }

  send(...args: any[]): void {
    this.socket.send(...args);
  }

  emit(e: string, ...args: any[]): void {
    this.socket.emit(e, ...args);
  }

  connect(): void {
    this.socket.connect();
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  constructor(private zone: NgZone) {}

  connect(url: string, opts?: Partial<ManagerOptions & SocketOptions>): SocketObserver {
    return this.createWs(url, opts);
  }

  private createWs(url: string, opts?: Partial<ManagerOptions & SocketOptions>): SocketObserver {
    let wrapper: SocketObserver = {} as SocketObserver;

    this.zone.runOutsideAngular(() => {
      wrapper = new SocketObserver(url, opts);
    });

    return wrapper;
  }
}
