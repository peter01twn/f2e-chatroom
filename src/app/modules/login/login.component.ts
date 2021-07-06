import { Component, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserAvatars } from 'src/app/core/user-avatars';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  avatarList = Object.keys(UserAvatars);

  userAvatar = this.fb.control(this.avatarList[0], [Validators.required]);

  userName = this.fb.control('', [Validators.required]);

  isRegister = false;

  constructor(
    private fb: FormBuilder,
    private user: UserService,
    private chat: ChatService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone
  ) {
    router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.isRegister = route.routeConfig?.path === 'register';
    });
  }

  enter(): void {
    this.user.update({ name: this.userName.value, avatar: this.userAvatar.value });
    this.user
      .login({
        account: 'test',
        password: 'test',
      })
      .subscribe(
        res => {
          this.chat.join$().subscribe(success => {
            if (success) {
              this.zone.run(() => {
                this.router.navigate(['../chat-room'], { relativeTo: this.route });
              });
            }
          });
        },
        err => {
          console.log(err);
        }
      );
  }

  register(): void {
    this.router.navigate(['../chat-room'], { relativeTo: this.route });
  }
}
