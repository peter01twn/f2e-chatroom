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

  get el(): HTMLElement {
    return this.elRef.nativeElement;
  }

  direction: 'vertical' | 'horizontal' = 'horizontal';

  controled = false;

  private pendingSize = 0;

  private pending = false;

  constructor(public vref: ViewContainerRef, public cd: ChangeDetectorRef, private elRef: ElementRef) {}

  checkMaxStretchSpace(): { grow: number; shrink: number } {
    if (this.solid) {
      return {
        shrink: 0,
        grow: 0,
      };
    }

    let size: number;

    if (this.pending) {
      size = this.pendingSize;
    } else {
      const { axisWidth } = this.getDOMRect();
      size = axisWidth;
    }

    return {
      shrink: size - this.minSize,
      grow: this.maxSize - size,
    };
  }

  strech(length: number): void {
    if (this.solid) {
      return;
    }

    if (this.pending) {
      this.pendingSize = this.pendingSize + length;
    } else {
      const { axisStyle, axisWidth } = this.getDOMRect();
      this.pending = true;
      this.pendingSize = axisWidth + length;

      requestAnimationFrame(() => {
        this.el.style[axisStyle] = `${this.pendingSize}px`;
        this.pending = false;
        this.controled = true;
        this.cd.markForCheck();
      });
    }
  }

  setSize(): void {
    const { axisStyle } = this.getDOMRect();
    this.el.style[axisStyle] = this.size;
  }

  getDOMRect(): { axisStyle: 'width' | 'height'; axisWidth: number; start: number; end: number } {
    const { width, height, left, right, top, bottom } = this.el.getBoundingClientRect();
    return {
      axisStyle: this.direction === 'horizontal' ? 'width' : 'height',
      axisWidth: this.direction === 'horizontal' ? width : height,
      start: this.direction === 'horizontal' ? left : top,
      end: this.direction === 'horizontal' ? right : bottom,
    };
  }
}
