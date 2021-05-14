import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
  ViewContainerRef,
  ElementRef,
  Inject,
} from '@angular/core';
import { Axis, ResizeAreaContainerBase, RESIZE_AREA_CONTAINER } from './resize-area-base';
import { ResizeAreaStylerService } from './resize-area-styler.service';

@Component({
  selector: 'app-resize-area',
  templateUrl: './resize-area.component.html',
  styleUrls: ['./resize-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [ResizeAreaStylerService],
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'resize-area',
  },
})
export class ResizeAreaComponent {
  @Input() solid = false;

  // size lies on axis that provided by user
  // it's a CSS value for Height or width rule to use
  @Input() size = 'auto';

  @Input() minSize = 0;

  @Input() maxSize = Infinity;

  get el(): HTMLElement {
    return this.elRef.nativeElement;
  }

  get axis(): Axis {
    return this.container.axis;
  }

  get containerSize(): number {
    return this.container.size;
  }

  private pending = false;
  private pendingSize: { width?: number; height?: number } = {};

  constructor(
    public vref: ViewContainerRef,
    @Inject(RESIZE_AREA_CONTAINER) private container: ResizeAreaContainerBase,
    private elRef: ElementRef<HTMLElement>
  ) {}

  checkMaxStretchSpace(): [number, number] {
    if (this.solid) {
      return [0, 0];
    }

    const size = this.getElSize(this.axis);

    return [Math.max(0, size - this.minSize), Math.max(0, this.maxSize - size)];
  }

  updateSize(size: number): void {
    if (this.solid) {
      return;
    }

    this.pendingSize[this.axis] = size;

    if (!this.pending) {
      this.pending = true;

      requestAnimationFrame(() => {
        const pendingSize = (this.pendingSize as { width: number; height: number })[this.axis];
        this.el.style[this.axis] = `${(pendingSize / this.containerSize) * 100}%`;
        this.pending = false;
        this.pendingSize = {};
      });
    }
  }

  getElSize(axis: Axis): number {
    if (this.pending && this.pendingSize[axis]) {
      return this.pendingSize[axis] as number;
    } else {
      return this.el.getBoundingClientRect()[axis];
    }
  }

  setStyle(style: [string, string | null] | null): void {
    if (style) {
      (this.el.style as any)[style[0]] = style[1];
    }
  }
}
