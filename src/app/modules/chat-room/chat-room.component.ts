import { Component, HostListener } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { ChatMessageService } from 'src/app/services/chat-message/chat-message.service';
import { UserInfoService } from 'src/app/services/user-info/user-info.service';

interface MsgDto {
  action: string;
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

  messageList: MsgDto[] = [];

  uId = '';

  constructor(private fb: FormBuilder, private msgService: ChatMessageService, private user: UserInfoService) {
    msgService.recive$.subscribe(msgObj => {
      this.messageList.push(msgObj as MsgDto);
    });

    user.get$.subscribe(({ id }) => (this.uId = id));
  }

  sendMsg(): void {
    this.msgService.send(this.newMessage.value);
    this.newMessage.setValue('');
  }

  resizeBlock(e: MouseEvent): void {}
}
