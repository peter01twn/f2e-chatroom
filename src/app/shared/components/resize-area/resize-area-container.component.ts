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
  forwardRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { Dimension, ResizeAreaContainerBase, RESIZE_AREA_CONTAINER } from './resize-area-base';
import { ResizeAreaComponent } from './resize-area.component';

interface ResizeLineTmpl {
  index: number;
  direction?: 'vertical' | 'horizontal';
}

const draggerWidth = 20;

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
  providers: [{ provide: RESIZE_AREA_CONTAINER, useExisting: forwardRef(() => ResizeAreaContainerComponent) }],
})
export class ResizeAreaContainerComponent implements ResizeAreaContainerBase, AfterViewInit {
  @Input() direction: 'vertical' | 'horizontal' = 'horizontal';

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

  get dimension(): Dimension {
    return this.direction === 'horizontal' ? 'width' : 'height';
  }

  get el(): HTMLElement {
    return this.elRef.nativeElement;
  }

  get size(): number {
    return this.el.getBoundingClientRect()[this.dimension];
  }

  readonly draggerWidth = 20;

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
      const draggerAmount = (this.resizeAreaList?.length ?? 0) - 1;
      const spaceForDragger = (draggerAmount * draggerWidth) / (this.resizeAreaList?.length ?? 1);

      this.resizeAreaList?.forEach((comp, i, list) => {
        if (i !== list.length - 1) {
          comp.vref.createEmbeddedView(this.resizeLineTmpl as TemplateRef<ResizeLineTmpl>, {
            index: i,
            direction: this.direction,
          });
        }

        const size = comp.size;

        if (size === 'auto') {
          comp.setStyle(['flex-grow', '1']);
        } else {
          comp.setStyle([this.dimension, `calc(${size} - ${spaceForDragger}px)`]);
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
      const [prevComp, prevLimit] = this.getResizableArea('max', lineIndex, false);
      const [nextComp, nextLimit] = this.getResizableArea('min', lineIndex + 1);

      prevArea = prevComp;
      nextArea = nextComp;
      movement = Math.min(movement, prevLimit, nextLimit);
    } else {
      const [prevComp, prevLimit] = this.getResizableArea('min', lineIndex, false);
      const [nextComp, nextLimit] = this.getResizableArea('max', lineIndex + 1);

      prevArea = prevComp;
      nextArea = nextComp;
      movement = -Math.min(Math.abs(movement), prevLimit, nextLimit);
    }

    prevArea?.updateSize(prevArea.getElSize(this.dimension) + movement);
    nextArea?.updateSize(nextArea.getElSize(this.dimension) - movement);
    prevArea?.setStyle(['flex=grow', '0']);
    nextArea?.setStyle(['flex=grow', '0']);
  }

  private getResizableArea(
    stretch: 'min' | 'max',
    beginIndex: number,
    order = true // true: find inc index, false: find dec index
  ): [ResizeAreaComponent | null, number] {
    if (!this.resizeAreaList) {
      return [null, 0];
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
        return [area, limitSize];
      }
    }

    return [null, 0];
  }

  private checkAreaLimitSize(area: ResizeAreaComponent): [number, number] {
    return area.checkMaxStretchSpace();
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
