import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvatarComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Input() icon?: string;

  @Input() color = 'inherit';

  @Input()
  get select(): any {
    return this._select;
  }

  set select(v: any) {
    this._select = coerceBooleanProperty(v);
  }

  // tslint:disable-next-line: variable-name
  private _select = false;

  // tslint:disable-next-line: no-output-native
  @Output() onClick = new EventEmitter<MouseEvent>();

  constructor() {}
}
