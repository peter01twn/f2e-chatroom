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
      const [prevStretchLength, prevComp] = this.getResizeTarget('grow', lineIndex, false);
      const [nextStretchLength, nextComp] = this.getResizeTarget('shrink', lineIndex + 1);

      prevArea = prevComp;
      nextArea = nextComp;
      movement = Math.min(movement, prevStretchLength, nextStretchLength);
    } else {
      const [prevStretchLength, prevComp] = this.getResizeTarget('shrink', lineIndex, false);
      const [nextStretchLength, nextComp] = this.getResizeTarget('grow', lineIndex + 1);

      prevArea = prevComp;
      nextArea = nextComp;
      movement = -Math.min(Math.abs(movement), prevStretchLength, nextStretchLength);
    }

    const containerRect = this.el.getBoundingClientRect();
    const containerSize = this.direction === 'horizontal' ? containerRect.width : containerRect.height;

    prevArea?.strech(movement, containerSize);
    nextArea?.strech(-movement, containerSize);
  }

  private getResizeTarget(
    direction: 'grow' | 'shrink',
    beginIndex: number,
    order = true
  ): [number, ResizeAreaComponent | null] {
    if (!this.resizeAreaList) {
      return [0, null];
    }

    let areaList = this.resizeAreaList.toArray();

    if (order) {
      areaList = areaList.slice(beginIndex);
    } else {
      areaList = areaList.slice(0, beginIndex + 1);
      areaList.reverse();
    }

    for (const area of areaList) {
      const stretchLength = area.checkMaxStretchSpace()[direction];
      if (stretchLength > 0) {
        return [stretchLength, area];
      }
    }

    return [0, null];
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
