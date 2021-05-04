import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserInfo {
  id: string;
  name: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  private userInfo: UserInfo = {
    id: '',
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
