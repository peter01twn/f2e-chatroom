import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ChatMessage } from 'src/app/core/entities/message';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UserInfo, UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent {
  @ViewChild('chatScreen') chatScreen?: ElementRef<HTMLElement>;

  newMessage = this.fb.control('');
  room = this.fb.control('');

  messageList: ChatMessage[] = [];
  userList: UserInfo[] = [];

  userInfo: UserInfo = {
    id: '',
    name: '',
    avatar: '',
  };

  get sidebarUsers(): UserInfo[] {
    return this.userList.filter(({ id }) => id !== this.userInfo.id);
  }

  get connectId(): string {
    return this.chatService.socket.id;
  }

  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private cd: ChangeDetectorRef,
    userInfoService: UserService
  ) {
    userInfoService.get$.subscribe(userInfo => (this.userInfo = userInfo));

    chatService.message$.subscribe(msg => {
      this.messageList.push(msg);
      cd.detectChanges();
    });

    chatService.userList$.subscribe(userList => {
      this.userList = userList;
      setTimeout(() => {
        cd.detectChanges();
      }, 0);
    });

    chatService.getRecords().subscribe(records => {
      this.messageList.push(...records);
      setTimeout(() => {
        if (this.chatScreen) {
          this.chatScreen.nativeElement.scrollTo(0, this.chatScreen.nativeElement.scrollHeight);
        }
      }, 0);
    });
  }

  sendMsg(): void {
    this.chatService.send(this.newMessage.value);
    this.newMessage.setValue('');
  }
}
