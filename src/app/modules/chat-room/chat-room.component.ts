import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { ChatMessageService } from 'src/app/services/chat-message/chat-message.service';
import { ChatRoomService } from 'src/app/services/chat-room/chat-room.service';
import { UserInfoService } from 'src/app/services/user-info/user-info.service';

interface MsgDto {
  owner: string;
  msg: string;
}

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent {
  newMessage = this.fb.control('');
  room = this.fb.control('');

  messageList: MsgDto[] = [];
  roomList: Observable<string[]>;
  uId = '';

  constructor(
    private fb: FormBuilder,
    private msgService: ChatMessageService,
    private roomService: ChatRoomService,
    user: UserInfoService,
    cd: ChangeDetectorRef
  ) {
    // msgService.recive('broadcast').subscribe(msgObj => {
    //   this.messageList.push(msgObj as MsgDto);
    // });
    user.get$.subscribe(({ id }) => (this.uId = id));

    this.roomList = roomService.watch$();
  }

  sendMsg(): void {
    this.msgService.broadcast(this.newMessage.value);
    this.newMessage.setValue('');
  }

  enterRoom(): void {
    this.roomService.enter(this.room.value);
    this.room.reset();
  }

  leaveRoom(roomId: any): void {
    this.roomService.leave(roomId);
  }
}
