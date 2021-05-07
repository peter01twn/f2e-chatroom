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

@Component({
  selector: 'app-resize-area',
  templateUrl: './resize-area.component.html',
  styleUrls: ['./resize-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'resize-area',
    '[style.flex-grow]': 'size === "auto" && !controled ? 1 : 0',
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
  private pendingStyle?: { width: number; height: number };

  constructor(
    public vref: ViewContainerRef,
    @Inject(RESIZE_AREA_CONTAINER) private container: ResizeAreaContainerBase,
    private elRef: ElementRef<HTMLElement>
  ) {}

  checkMaxStretchSpace(): [number, number] {
    if (this.solid) {
      return [0, 0];
    }

    const { width, height } = this.getElSize();
    const size = this.axis === 'width' ? width : height;

    return [Math.max(0, size - this.minSize), Math.max(0, this.maxSize - size)];
  }

  updateSize(size: number): void {
    if (this.solid) {
      return;
    }

    this.pendingStyle = this.getElSize();
    this.pendingStyle[this.axis] = size;

    if (!this.pending) {
      this.pending = true;

      requestAnimationFrame(() => {
        const pendingSize = (this.pendingStyle as { width: number; height: number })[this.axis];
        this.el.style[this.axis] = `${(pendingSize / this.containerSize) * 100}%`;
        this.pending = false;
      });
    }
  }

  getElSize(): { width: number; height: number } {
    if (this.pending && this.pendingStyle) {
      return this.pendingStyle;
    } else {
      const { width, height } = this.el.getBoundingClientRect();
      return { width, height };
    }
  }

  setStyle(style: [string, string | null] | null): void {
    if (style) {
      (this.el.style as any)[style[0]] = style[1];
    }
  }
}
