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
import { Axis, ResizeAreaContainerBase } from './resize-area-base';
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
export class ResizeAreaContainerComponent implements ResizeAreaContainerBase, AfterViewInit {
  @Input() direction: 'vertical' | 'horizontal' = 'horizontal';

  @Input() height = 'auto';

  @Input() width = 'auto';

  @ViewChild('resizeLine') resizeLineTmpl?: TemplateRef<ResizeLineTmpl>;

  @ContentChildren(ResizeAreaComponent) resizeAreaList?: QueryList<ResizeAreaComponent>;

  dragStart$ = new Subject<[MouseEvent, number]>();
  dragCancel$ = new Subject();
  mouseMove$ = new Subject<MouseEvent>();

  resizeLineDrag$ = this.dragStart$.asObservable().pipe(
    mergeMap(([, index]) =>
      this.mouseMove$.asObservable().pipe(
        takeUntil(this.dragCancel$),
        map(e => [e, index] as [MouseEvent, number])
      )
    )
  );

  get axis(): Axis {
    return this.direction === 'horizontal' ? 'width' : 'height';
  }

  get el(): HTMLElement {
    return this.elRef.nativeElement;
  }

  private currentDragLine?: HTMLElement;

  constructor(private elRef: ElementRef) {
    this.dragStart$.subscribe(([e]) => {
      this.currentDragLine = e.target as HTMLElement;
      this.currentDragLine.classList.add('resize-line-hold');
    });

    this.resizeLineDrag$.subscribe({
      next: ([e, i]) => {
        e.preventDefault();
        this.resizeArea(this.direction === 'vertical' ? e.movementY : e.movementX, i);
      },
    });

    this.dragCancel$.subscribe(() => {
      this.currentDragLine?.classList.remove('resize-line-hold');
      this.currentDragLine = undefined;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.resizeAreaList?.forEach((comp, i, list) => {
        // 初始化元素大小
        comp.direction = this.direction;
        comp.setOriginSize();

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

    let prevArea: ResizeAreaComponent | null;
    let nextArea: ResizeAreaComponent | null;

    if (movement > 0) {
      prevArea = this.getResizableArea('max', lineIndex, false);
      nextArea = this.getResizableArea('min', lineIndex + 1);

      movement = Math.min(movement, prevArea?.maxSize, nextArea?.minSize);
    } else {
      const [prevStretchLength, prevComp] = this.getResizableArea('min', lineIndex, false);
      const [nextStretchLength, nextComp] = this.getResizableArea('max', lineIndex + 1);

      prevArea = prevComp;
      nextArea = nextComp;
      movement = -Math.min(Math.abs(movement), prevStretchLength, nextStretchLength);
    }

    const containerRect = this.el.getBoundingClientRect();
    const containerSize = this.direction === 'horizontal' ? containerRect.width : containerRect.height;

    prevArea?.strech(movement, containerSize);
    nextArea?.strech(-movement, containerSize);
  }

  private getResizableArea(
    stretch: 'min' | 'max',
    beginIndex: number,
    order = true // true: find inc index, false: find dec index
  ): ResizeAreaComponent | null {
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
      const [min, max] = this.checkAreaLimitSize(area);
      const limitSize = stretch === 'max' ? max : min;

      if (limitSize > 0) {
        return area;
      }
    }

    return null;
  }

  private checkAreaLimitSize(area: ResizeAreaComponent): [number, number] {
    if (area.solid) {
      return [0, 0];
    }

    const size = area.getElSize(this.axis);

    return [Math.max(0, size - area.minSize), Math.max(0, area.maxSize - size)];
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(e: MouseEvent): void {
    this.mouseMove$.next(e);
  }

  @HostListener('mouseup', ['$event'])
  onMouseup(e: MouseEvent): void {
    this.dragCancel$.next(e);
  }

  @HostListener('mouseleave', ['$event'])
  onMouseleave(e: MouseEvent): void {
    this.dragCancel$.next(e);
  }
}
