import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-msg-input-box',
  templateUrl: './msg-input-box.component.html',
  styleUrls: ['./msg-input-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'msg-input-box',
  },
})
export class MsgInputBoxComponent {
  constructor() {}
}
