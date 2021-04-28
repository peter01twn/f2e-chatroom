import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { ForwardBtnComponent } from './components/forward-btn/forward-btn.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { UserInfoCardComponent } from './components/user-info-card/user-info-card.component';
import { MsgInputBoxComponent } from './components/msg-input-box/msg-input-box.component';

@NgModule({
  declarations: [ForwardBtnComponent, UserAvatarComponent, UserInfoCardComponent, MsgInputBoxComponent],
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
  ],
  exports: [
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatIconModule,
    MatGridListModule,
    ForwardBtnComponent,
    UserAvatarComponent,
    UserInfoCardComponent,
    MatButtonModule,
    MsgInputBoxComponent,
    MatMenuModule,
    MatTabsModule,
  ],
})
export class SharedModule {}
