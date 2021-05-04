import { Component, ChangeDetectionStrategy, Input, ViewEncapsulation, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-resize-area',
  templateUrl: './resize-area.component.html',
  styleUrls: ['./resize-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'resize-area',
    '[class.resize-area-grow]': 'grow',
    '[style.height]': 'height',
    '[style.width]': 'width',
  },
})
export class ResizeAreaComponent {
  @Input() height = 'auto';

  @Input() width = 'auto';

  @Input() grow = true;

  @Input() minSize?: number | 'fit-content' = 'fit-content';

  @Input() maxSize = Infinity;

  constructor(public vref: ViewContainerRef) {}
}
