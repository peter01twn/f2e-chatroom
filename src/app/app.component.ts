import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { UserAvatars } from './core/user-avatars';
import { isPlatformServer } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(domSanitizer: DomSanitizer, icon: MatIconRegistry, @Inject(PLATFORM_ID) platformId: object) {
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
  }
}
