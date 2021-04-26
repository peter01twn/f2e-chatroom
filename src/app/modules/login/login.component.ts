import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserAvatars } from 'src/app/core/user-avatars';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  userAvatars = Object.keys(UserAvatars);

  userAvatar = this.userAvatars[0];

  userName = this.fb.control('');

  constructor(private fb: FormBuilder) {}

  selectAvatar(avatar: string): void {
    this.userAvatar = avatar;
  }
}
