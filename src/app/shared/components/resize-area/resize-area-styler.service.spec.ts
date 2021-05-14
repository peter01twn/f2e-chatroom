import { TestBed } from '@angular/core/testing';

import { ResizeAreaStylerService } from './resize-area-styler.service';

describe('ResizeAreaStylerService', () => {
  let service: ResizeAreaStylerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResizeAreaStylerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
