import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { UserAvatars } from './core/user-avatars';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(domSanitizer: DomSanitizer, icon: MatIconRegistry) {
    for (const iconName in UserAvatars) {
      if (Object.prototype.hasOwnProperty.call(UserAvatars, iconName)) {
        const iconPath = UserAvatars[iconName];
        icon.addSvgIconInNamespace('avatar', iconName, domSanitizer.bypassSecurityTrustResourceUrl(iconPath));
      }
    }
  }
}
