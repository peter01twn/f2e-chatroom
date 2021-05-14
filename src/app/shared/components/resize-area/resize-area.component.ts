import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
  ViewContainerRef,
  ElementRef,
  Inject,
} from '@angular/core';
import { Dimension, ResizeAreaContainerBase, RESIZE_AREA_CONTAINER } from './resize-area-base';
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

  // size lies on Dimension that provided by user
  // it's a CSS value for Height or width rule to use
  @Input() size = 'auto';

  @Input() minSize = 0;

  @Input() maxSize = Infinity;

  get el(): HTMLElement {
    return this.elRef.nativeElement;
  }

  get dimension(): Dimension {
    return this.container.dimension;
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

    const size = this.getElSize(this.dimension);

    return [Math.max(0, size - this.minSize), Math.max(0, this.maxSize - size)];
  }

  updateSize(size: number): void {
    if (this.solid) {
      return;
    }

    this.pendingSize[this.dimension] = size;

    if (!this.pending) {
      this.pending = true;

      requestAnimationFrame(() => {
        const pendingSize = (this.pendingSize as { width: number; height: number })[this.dimension];
        this.el.style[this.dimension] = `${(pendingSize / this.containerSize) * 100}%`;
        this.pending = false;
        this.pendingSize = {};
      });
    }
  }

  getElSize(dimension: Dimension): number {
    if (this.pending && this.pendingSize[dimension]) {
      return this.pendingSize[dimension] as number;
    } else {
      return this.el.getBoundingClientRect()[dimension];
    }
  }

  setStyle(style: [string, string | null] | null): void {
    if (style) {
      (this.el.style as any)[style[0]] = style[1];
    }
  }
}
