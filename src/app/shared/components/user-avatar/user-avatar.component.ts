import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { UserAvatars } from './user-avatars';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'user-avatar',
    '[class.user-avatar-lg]': 'size === "lg"',
    '[class.user-avatar-selected]': 'select',
    '[style.color]': 'color',
  },
})
export class UserAvatarComponent {
  @Input() size: 'md' | 'lg' = 'md';

  @Input() icon?: string;

  @Input() color = 'currentColor';

  @Input()
  get select(): any {
    return this._select;
  }

  set select(v: any) {
    this._select = coerceBooleanProperty(v);
  }

  // tslint:disable-next-line: variable-name
  private _select = false;

  constructor(domSanitizer: DomSanitizer, icon: MatIconRegistry) {
    for (const iconName in UserAvatars) {
      if (Object.prototype.hasOwnProperty.call(UserAvatars, iconName)) {
        const iconPath = UserAvatars[iconName];
        icon.addSvgIconInNamespace('avatar', iconName, domSanitizer.bypassSecurityTrustResourceUrl(iconPath));
      }
    }
  }
}
