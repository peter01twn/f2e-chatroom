import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private connectionPool = new Map();

  connect(url: string): Subject<unknown> {
    let connection = this.connectionPool.get(url);

    if (!connection) {
      connection = this.createWs(url);
      this.connectionPool.set(url, connection);
    }

    return connection;
  }

  private createWs(url: string): Subject<unknown> {
    const ws = new WebSocket(url);

    const observable = new Observable(subscriber => {
      ws.onmessage = res => subscriber.next(JSON.parse(res.data));
      ws.onclose = () => subscriber.complete();
      ws.onerror = err => subscriber.error(err);
    });

    const observer = {
      next: (data: unknown) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      },
    };

    return Subject.create(observer, observable);
  }
}
