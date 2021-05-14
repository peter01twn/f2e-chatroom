import { Directive, ElementRef, HostBinding, HostListener, Inject, EventEmitter } from '@angular/core';
import { ResizeAreaContainerBase, RESIZE_AREA_CONTAINER } from './resize-area-base';

@Directive({
  selector: '[appResizeDragger]',
})
export class ResizeDraggerDirective {
  @HostBinding('class.resize-dragger') className = true;

  @HostBinding('class.resize-dragger-vertical')
  get vertical(): boolean {
    return this.container.direction === 'vertical';
  }

  constructor(public el: ElementRef, @Inject(RESIZE_AREA_CONTAINER) private container: ResizeAreaContainerBase) {}

  @HostListener('mousedown') mouseDown$ = new EventEmitter<MouseEvent>();
}
