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
import { MatExpansionModule } from '@angular/material/expansion';

import { QuillModule } from 'ngx-quill';

import { ForwardBtnComponent } from './components/forward-btn/forward-btn.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { UserInfoCardComponent } from './components/user-info-card/user-info-card.component';
import { ChatMsgComponent } from './components/chat-msg/chat-msg.component';
import { ResizeAreaComponent } from './components/resize-area/resize-area.component';
import { ResizeAreaContainerComponent } from './components/resize-area/resize-area-container.component';

@NgModule({
  declarations: [
    ForwardBtnComponent,
    UserAvatarComponent,
    UserInfoCardComponent,
    ChatMsgComponent,
    ResizeAreaComponent,
    ResizeAreaContainerComponent,
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
    MatExpansionModule,
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
    MatExpansionModule,

    // component
    ForwardBtnComponent,
    UserAvatarComponent,
    UserInfoCardComponent,
    ChatMsgComponent,
    ResizeAreaComponent,
    ResizeAreaContainerComponent,
  ],
})
export class SharedModule {}
