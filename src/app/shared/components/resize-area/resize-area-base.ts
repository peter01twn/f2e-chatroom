import { InjectionToken } from '@angular/core';

export const RESIZE_AREA_CONTAINER = new InjectionToken<ResizeAreaContainerBase>('RESIZE_AREA_CONTAINER');

export type Axis = 'width' | 'height';

export interface ResizeAreaContainerBase {
  axis: Axis;
  size: number;
}

export interface ResizeAreaBase {
  solid: boolean;
  size: string;
  minSize: number;
  maxSize: number;
}
