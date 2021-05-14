import { Injectable } from '@angular/core';
import { ResizeAreaBase, ResizeAreaContainerBase } from './resize-area-base';

@Injectable()
export class ResizeAreaStylerService {
  container?: ResizeAreaContainerBase;

  resizeArea?: ResizeAreaBase;

  constructor() {}
}
