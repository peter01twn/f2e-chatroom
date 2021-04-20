import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardBtnComponent } from './forward-btn.component';

describe('ForwardBtnComponent', () => {
  let component: ForwardBtnComponent;
  let fixture: ComponentFixture<ForwardBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForwardBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwardBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
