import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';

@NgModule({
  declarations: [
    UserAvatarComponent
  ],
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule, MatIconModule, MatGridListModule],
  exports: [FormsModule, HttpClientModule, ReactiveFormsModule, MatIconModule, MatGridListModule, UserAvatarComponent],
})
export class SharedModule {}
