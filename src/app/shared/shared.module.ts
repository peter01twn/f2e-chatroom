import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';

import { QuillModule } from 'ngx-quill';

import { ForwardBtnComponent } from './components/forward-btn/forward-btn.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { UserInfoCardComponent } from './components/user-info-card/user-info-card.component';
import { MsgInputBoxComponent } from './components/msg-input-box/msg-input-box.component';
import { ChatMsgComponent } from './components/chat-msg/chat-msg.component';

@NgModule({
  declarations: [
    ForwardBtnComponent,
    UserAvatarComponent,
    UserInfoCardComponent,
    MsgInputBoxComponent,
    ChatMsgComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatGridListModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    MatSidenavModule,
    QuillModule,
  ],
  exports: [
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatIconModule,
    MatGridListModule,
    QuillModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    MatSidenavModule,
    ForwardBtnComponent,
    UserAvatarComponent,
    UserInfoCardComponent,
    MsgInputBoxComponent,
    ChatMsgComponent,
  ],
})
export class SharedModule {}
