import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../service/message/message.service';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
})
export class MessagesComponent implements OnInit {

  constructor(public message: MessageService) {}

  ngOnInit() {
  }

}
