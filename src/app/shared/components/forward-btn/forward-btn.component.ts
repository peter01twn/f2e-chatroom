import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-forward-btn, [app-forward-btn]',
  templateUrl: './forward-btn.component.html',
  styleUrls: ['./forward-btn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'forward-btn',
  },
})
export class ForwardBtnComponent {}
