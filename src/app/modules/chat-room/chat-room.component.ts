import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { map } from 'rxjs/operators';
import { ChatService, Message } from 'src/app/services/chat/chat.service';
import { UserInfo, UserInfoService } from 'src/app/services/user-info/user-info.service';

interface ProfileMessage extends Message {
  icon: string;
  name: string;
}

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent {
  newMessage = this.fb.control('');
  room = this.fb.control('');

  messageList: ProfileMessage[] = [];
  userList: UserInfo[] = [];

  userInfo: UserInfo = {
    id: '',
    name: '',
    avatar: '',
  };

  constructor(
    private fb: FormBuilder,
    private msgService: ChatService,
    private cd: ChangeDetectorRef,
    userInfoService: UserInfoService
  ) {
    userInfoService.get$.subscribe(userInfo => (this.userInfo = userInfo));

    msgService.message$
      .pipe(
        map(msg => {
          const user = this.userList.find(({ id }) => id === msg.owner) ?? this.userInfo;
          return { ...msg, icon: user.avatar, name: user.name };
        })
      )
      .subscribe(profileMsg => {
        this.messageList.push(profileMsg);
        cd.detectChanges();
      });

    msgService.userList$.subscribe(userList => {
      this.userList = userList;
      setTimeout(() => {
        cd.detectChanges();
      }, 0);
    });
  }

  sendMsg(): void {
    this.msgService.send(this.newMessage.value);
    this.newMessage.setValue('');
  }
}
