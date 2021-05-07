import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
  ViewContainerRef,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';

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

  @Input() size = 'auto';

  @Input() minSize = 0;

  @Input() maxSize = Infinity;

  direction: 'vertical' | 'horizontal' = 'horizontal';

  controled = false;

  get axis(): 'width' | 'height' {
    return this.direction === 'horizontal' ? 'width' : 'height';
  }

  get el(): HTMLElement {
    return this.elRef.nativeElement;
  }

  private pendingSize = 0;

  private pending = false;

  private containerSize?: number;

  constructor(public vref: ViewContainerRef, public cd: ChangeDetectorRef, private elRef: ElementRef) {}

  checkMaxStretchSpace(): { grow: number; shrink: number } {
    if (this.solid) {
      return {
        shrink: 0,
        grow: 0,
      };
    }

    const size = this.getElSize();

    return {
      shrink: size - this.minSize,
      grow: this.maxSize - size,
    };
  }

  strech(length: number, containerSize: number): void {
    if (this.solid || length === 0) {
      return;
    }

    const size = this.getElSize();

    this.updateSize(size + length, containerSize);
  }

  setOriginSize(): void {
    this.el.style[this.axis] = this.size;
    this.controled = false;
  }

  updateSize(size: number, containerSize: number): void {
    if (this.solid) {
      return;
    }

    this.containerSize = containerSize;
    this.pendingSize = size;

    if (!this.pending) {
      this.pending = true;

      requestAnimationFrame(() => {
        this.el.style[this.axis] = `${(this.pendingSize / (this.containerSize as number)) * 100}%`;
        this.pending = false;
        this.controled = true;
      });
    }
  }

  getElSize(): number {
    if (this.pending) {
      return this.pendingSize;
    } else {
      return this.el.getBoundingClientRect()[this.axis];
    }
  }
}
