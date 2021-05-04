import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeAreaComponent } from './resize-area.component';

describe('ResizeAreaComponent', () => {
  let component: ResizeAreaComponent;
  let fixture: ComponentFixture<ResizeAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResizeAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizeAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
