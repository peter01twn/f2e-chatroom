import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  HostListener,
  AfterViewInit,
  Input,
  ContentChildren,
  QueryList,
  ViewContainerRef,
  ViewChild,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { ResizeAreaComponent } from './resize-area.component';

interface ResizeLineTmpl {
  index: number;
  direction?: 'vertical' | 'horizontal';
}

@Component({
  selector: 'app-resize-area-container',
  templateUrl: './resize-area-container.component.html',
  styleUrls: ['./resize-area-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'resize-area-container',
    '[class.resize-area-container-vertical]': 'direction === "vertical"',
  },
})
export class ResizeAreaContainerComponent implements AfterViewInit {
  @Input() direction: 'vertical' | 'horizontal' = 'horizontal';

  @Input() height = 'auto';

  @Input() width = 'auto';

  @ViewChild('resizeLine') resizeLineTmpl?: TemplateRef<ResizeLineTmpl>;

  @ContentChildren(ResizeAreaComponent) resizeAreaList?: QueryList<ResizeAreaComponent>;

  dragStart = new Subject<[MouseEvent, number]>();
  dragCancel = new Subject();
  mouseMove = new Subject<MouseEvent>();

  resizeLineDrag$ = this.dragStart.asObservable().pipe(
    mergeMap(([, index]) =>
      this.mouseMove.asObservable().pipe(
        takeUntil(this.dragCancel),
        map(e => [e, index] as [MouseEvent, number])
      )
    )
  );

  get el(): HTMLElement {
    return this.elRef.nativeElement;
  }

  constructor(private elRef: ElementRef) {
    this.resizeLineDrag$.subscribe(([e, i]) => {
      this.resizeArea(this.direction === 'vertical' ? e.movementY : e.movementX, i);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.resizeAreaList?.forEach((comp, i, list) => {
        // 初始化元素大小
        comp.direction = this.direction;
        comp.setSize();

        if (i !== list.length - 1) {
          comp.vref.createEmbeddedView(this.resizeLineTmpl as TemplateRef<ResizeLineTmpl>, {
            index: i,
            direction: this.direction,
          });
        }
      });
    }, 0);
  }

  resizeArea(movement: number, lineIndex: number): void {
    if (!this.resizeAreaList) {
      return;
    }

    const prevArea = this.findResizableArea(lineIndex, false);
    const nextArea = this.findResizableArea(lineIndex + 1);

    // no area can resize
    if (!(prevArea || nextArea)) {
      return;
    }

    const prevStretchSpace = prevArea?.checkMaxStretchSpace();
    const nextStretchSpace = nextArea?.checkMaxStretchSpace();

    if (movement > 0) {
      const prevStretch = prevStretchSpace?.grow ?? Infinity;
      let nextStretch = nextStretchSpace?.shrink ?? Infinity;

      if (!nextArea) {
        const { end } = this.resizeAreaList.first.getDOMRect();
        const { end: containerEnd } = this.getDOMRect();
        nextStretch = containerEnd - end;
      }

      movement = Math.min(movement, prevStretch, nextStretch);
    } else {
      let prevStretch = prevStretchSpace?.shrink ?? Infinity;
      const nextStretch = nextStretchSpace?.grow ?? Infinity;

      if (!prevArea) {
        const { start } = this.resizeAreaList.first.getDOMRect();
        const { start: containerStart } = this.getDOMRect();
        prevStretch = start - containerStart;
      }

      movement = -Math.min(Math.abs(movement), prevStretch, nextStretch);
    }

    prevArea?.strech(movement);
    nextArea?.strech(-movement);
  }

  private findResizableArea(beginIndex: number, order = true): ResizeAreaComponent | null {
    if (!this.resizeAreaList) {
      return null;
    }

    let areaList = this.resizeAreaList.toArray();

    if (order) {
      areaList = areaList.slice(beginIndex);
    } else {
      areaList = areaList.slice(0, beginIndex + 1);
      areaList.reverse();
    }

    for (const area of areaList) {
      if (!area.solid) {
        return area;
      }
    }

    return null;
  }

  private getDOMRect(): { axisStyle: 'width' | 'height'; axisWidth: number; start: number; end: number } {
    const { width, height, left, right, top, bottom } = this.el.getBoundingClientRect();
    return {
      axisStyle: this.direction === 'horizontal' ? 'width' : 'height',
      axisWidth: this.direction === 'horizontal' ? width : height,
      start: this.direction === 'horizontal' ? left : top,
      end: this.direction === 'horizontal' ? right : bottom,
    };
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(e: MouseEvent): void {
    this.mouseMove.next(e);
  }

  @HostListener('mouseup', ['$event'])
  onMouseup(e: MouseEvent): void {
    this.dragCancel.next(e);
  }

  @HostListener('mouseleave', ['$event'])
  onMouseleave(e: MouseEvent): void {
    this.dragCancel.next(e);
  }
}
