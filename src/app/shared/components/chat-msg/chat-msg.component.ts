import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'app-chat-msg',
  templateUrl: './chat-msg.component.html',
  styleUrls: ['./chat-msg.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'chat-msg',
    '[class.chat-msg-rtl]': 'direction === "rtl"',
  },
})
export class ChatMsgComponent {
  @Input() content = '';

  @Input() direction: 'rtl' | 'ltr' = 'ltr';

  @Input() discussionCount = 0;
}
