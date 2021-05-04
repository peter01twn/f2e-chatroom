import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeAreaContainerComponent } from './resize-area-container.component';

describe('ResizeAreaContainerComponent', () => {
  let component: ResizeAreaContainerComponent;
  let fixture: ComponentFixture<ResizeAreaContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResizeAreaContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizeAreaContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
