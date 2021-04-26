import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgInputBoxComponent } from './msg-input-box.component';

describe('MsgInputBoxComponent', () => {
  let component: MsgInputBoxComponent;
  let fixture: ComponentFixture<MsgInputBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsgInputBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgInputBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
