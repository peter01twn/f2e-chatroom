import { TestBed } from '@angular/core/testing';

import { CanEnterChatRoomGuard } from './login.guard';

describe('CanEnterChatRoomGuard', () => {
  let guard: CanEnterChatRoomGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanEnterChatRoomGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
