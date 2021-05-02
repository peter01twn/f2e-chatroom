import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnInit {
  discuss = '<p class="ql-align-center">asd<strong>as</strong>dasd</p>';

  constructor() {}

  ngOnInit(): void {}
}
