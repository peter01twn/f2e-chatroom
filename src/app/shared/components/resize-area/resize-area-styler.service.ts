import { Inject, Injectable } from '@angular/core';
import { ResizeAreaBase, ResizeAreaContainerBase, RESIZE_AREA_CONTAINER } from './resize-area-base';

@Injectable()
export class ResizeAreaStylerService {
  resizeArea?: ResizeAreaBase;

  private pendingType?: 'width' | 'height';
  private pendingValue?: number;

  constructor(@Inject(RESIZE_AREA_CONTAINER) private container: ResizeAreaContainerBase) {}

  initSize(): void {}

  setStyle(style: [string, string | null] | null): void {
    if (style) {
      (this.resizeArea?.el.style as any)[style[0]] = style[1];
    }
  }
}
