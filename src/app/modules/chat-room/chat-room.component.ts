import { Component } from '@angular/core';
import { ChatMessageService } from 'src/app/services/chat-message/chat-message.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent {
  constructor(private msgService: ChatMessageService) {
    msgService.recive$.subscribe(msgObj => {
      console.log(msgObj);
    });
  }
}
