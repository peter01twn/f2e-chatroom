import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

const StoreTokenKey = 'user_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  get isLogin(): boolean {
    return !!this.getAuthorizationToken();
  }

  private localStorage;

  constructor(@Inject(DOCUMENT) document: Document) {
    this.localStorage = document.defaultView?.localStorage;
  }

  setAuthorizationToken(token: string): void {
    this.localStorage?.setItem(StoreTokenKey, token);
  }

  getAuthorizationToken(): string | null | undefined {
    return this.localStorage?.getItem(StoreTokenKey);
  }
}
