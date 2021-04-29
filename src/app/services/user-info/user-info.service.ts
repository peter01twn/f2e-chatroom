import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface UserInfo {
  name: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  private userInfo: UserInfo = {
    name: '',
    avatar: '',
  };

  private userInfo$ = new BehaviorSubject<UserInfo>(this.userInfo);

  get$ = this.userInfo$.asObservable();

  set(info: UserInfo): void {
    this.userInfo = info;
  }

  update(info: Partial<UserInfo>): void {
    this.userInfo = { ...(this.userInfo as UserInfo), ...info };
  }
}
