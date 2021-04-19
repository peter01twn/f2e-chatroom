import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Avatars } from './avatars';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(domSanitizer: DomSanitizer, icon: MatIconRegistry) {
    for (const iconName in Avatars) {
      if (Object.prototype.hasOwnProperty.call(Avatars, iconName)) {
        const iconPath = Avatars[iconName];
        icon.addSvgIconInNamespace('avatar', iconName, domSanitizer.bypassSecurityTrustResourceUrl(iconPath));
      }
    }
  }
}
