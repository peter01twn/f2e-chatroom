import { InjectionToken } from '@angular/core';

export const RESIZE_AREA_CONTAINER = new InjectionToken<ResizeAreaContainerBase>('RESIZE_AREA_CONTAINER');

export interface ResizeAreaContainerBase {
  axis: Axis;
  size: number;
}

export type Axis = 'width' | 'height';
