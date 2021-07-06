import { AuthService } from './../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface UserInfo {
  id: string;
  name: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userInfo: UserInfo = {
    id: '',
    name: '',
    avatar: '',
  };

  private userInfo$ = new BehaviorSubject<UserInfo>(this.userInfo);

  get$ = this.userInfo$.asObservable();

  constructor(private http: HttpClient, private auth: AuthService) {}

  login(loginInfo: { account: string; password: string }): Observable<boolean> {
    return this.http.post<{ token: string }>('http://localhost:3000/api/user/login', loginInfo).pipe(
      map((res: { token: string }) => {
        this.auth.setAuthorizationToken(res.token);
        return true;
      }),
      catchError((err: any) => {
        return throwError(err.error.message);
      })
    );
  }

  set(info: UserInfo): void {
    this.userInfo = info;
  }

  update(info: Partial<UserInfo>): void {
    this.userInfo = { ...this.userInfo, ...info };
    this.userInfo$.next(this.userInfo);
  }
}
