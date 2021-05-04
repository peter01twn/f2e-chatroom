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

  constructor() {
    this.resizeLineDrag$.subscribe(([e, i]) => {
      this.resizeArea(this.direction === 'vertical' ? e.movementY : e.movementX, i);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.resizeAreaList?.forEach((comp, i, list) => {
        if (i !== list.length - 1) {
          comp.vref.createEmbeddedView(this.resizeLineTmpl as TemplateRef<ResizeLineTmpl>, {
            index: i,
            direction: this.direction,
          });
        }
      });
    }, 0);
  }

  resizeArea(movement: number, i: number): void {
    const prevArea = this.resizeAreaList?.get(i);
    const nextArea = this.resizeAreaList?.get(i + 1);
    const prevEl = prevArea?.vref.element.nativeElement as HTMLElement;
    const nextEl = nextArea?.vref.element.nativeElement as HTMLElement;
    const { width: prevW, height: prevH } = prevEl.getBoundingClientRect();
    const { width: nextW, height: nextH } = nextEl.getBoundingClientRect();

    if (this.direction === 'vertical') {
      prevEl.style.height = `${this.boundNum(prevH + movement)}px`;
      nextEl.style.height = `${nextH - movement}px`;
    } else {
      prevEl.style.width = `${prevW + movement}px`;
      nextEl.style.width = `${nextW - movement}px`;
    }
  }

  boundNum(number: number, min = 0, max = Infinity): number {
    return Math.min(Math.max(number, min), max);
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
