import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'app-msg-input-box',
  templateUrl: './msg-input-box.component.html',
  styleUrls: ['./msg-input-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'msg-input-box',
    '[style.max-height]': 'maxHeight',
  },
})
export class MsgInputBoxComponent {
  @Input() maxHeight: number | string = 'none';
}
