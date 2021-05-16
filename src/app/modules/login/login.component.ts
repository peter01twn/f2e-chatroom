import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAvatars } from 'src/app/core/user-avatars';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UserInfoService } from 'src/app/services/user-info/user-info.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  userAvatars = Object.keys(UserAvatars);

  userAvatar = this.userAvatars[0];

  userName = this.fb.control('');

  constructor(
    private fb: FormBuilder,
    private user: UserInfoService,
    private chat: ChatService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone
  ) {}

  selectAvatar(avatar: string): void {
    this.userAvatar = avatar;
  }

  enter(): void {
    this.user.update({ name: this.userName.value, avatar: this.userAvatar });
    this.chat.join$().subscribe(success => {
      if (success) {
        this.zone.run(() => {
          this.router.navigate(['../chat-room'], { relativeTo: this.route });
        });
      }
    });
  }
}
