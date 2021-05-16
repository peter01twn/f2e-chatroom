import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanEnterChatRoomGuard } from 'src/app/core/guard/can-enter-chat-room.guard';
import { ChatRoomComponent } from './chat-room.component';

const routes: Routes = [{ path: '', component: ChatRoomComponent, canActivate: [CanEnterChatRoomGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoomRoutingModule {}
