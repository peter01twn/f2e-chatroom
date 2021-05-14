import { Injectable, NgZone } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

export class SocketObserver {
  get id(): string {
    return this.socket.id;
  }

  private socket: Socket;

  constructor(uri: string, opts?: Partial<ManagerOptions & SocketOptions>) {
    this.socket = io(uri, opts);
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
