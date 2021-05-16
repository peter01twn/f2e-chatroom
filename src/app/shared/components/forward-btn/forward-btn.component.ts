import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-forward-btn, [app-forward-btn]',
  templateUrl: './forward-btn.component.html',
  styleUrls: ['./forward-btn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'forward-btn',
    '[attr.disabled]': 'disabled || null',
  },
})
export class ForwardBtnComponent {
  @HostBinding('class.forward-btn-disabled')
  @Input()
  disabled = false;
}
