import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeDraggerComponent } from './resize-dragger.component';

describe('ResizeDraggerComponent', () => {
  let component: ResizeDraggerComponent;
  let fixture: ComponentFixture<ResizeDraggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResizeDraggerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizeDraggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
