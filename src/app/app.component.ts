import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { UserAvatars } from './core/user-avatars';
import { isPlatformServer } from '@angular/common';
import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routerAnimation', [
      transition('login <=> register', [
        style({ position: 'relative', height: '100%' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }),
        ]),
        query(':enter .login-box', [style({ opacity: 0 })]),
        query(':leave .login-box', animateChild()),
        group([
          query(':leave .login-box', [animate('300ms ease-out', style({ opacity: 0 }))]),
          query(':enter .login-box', [animate('300ms ease-out', style({ opacity: 1 }))]),
        ]),
        query(':enter .login-box', animateChild()),
      ]),
    ]),
  ],
})
export class AppComponent {
  animateData?: string;

  constructor(
    route: ActivatedRoute,
    router: Router,
    domSanitizer: DomSanitizer,
    icon: MatIconRegistry,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    for (const iconName in UserAvatars) {
      if (Object.prototype.hasOwnProperty.call(UserAvatars, iconName)) {
        const iconPath = UserAvatars[iconName];
        if (isPlatformServer(platformId)) {
          icon.addSvgIconLiteralInNamespace('avatar', iconName, domSanitizer.bypassSecurityTrustHtml('<svg></svg>'));
        } else {
          icon.addSvgIconInNamespace('avatar', iconName, domSanitizer.bypassSecurityTrustResourceUrl(iconPath));
        }
      }
    }

    router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.animateData = route.firstChild?.snapshot.data.animation;
    });
  }
}
