import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { socketMessage } from './socketMessage';

@Injectable({
  providedIn: 'root'
})
export class SocketConnectionService {

  private stompClient: any = null;
  private projectId: String;
  private pageId: String;
  private userId: String;

  constructor() { }

  connect(projectId: String, pageId: String, userId: String) {
    this.userId = userId;
    this.projectId = projectId;
    this.pageId = pageId;
    const socket = new SockJS('http://localhost:8090/connect');
    this.stompClient = Stomp.over(socket);
    const _this = this;
    this.stompClient.connect({}, function (frame) {
      _this.stompClient.subscribe('/user/' + userId + '/queue/send', function (message) {
        _this.logMessage(message.body);
      });
      console.log('Connected: ' + frame);
    });
  }

  send(content: String, command: String) {
    let message: socketMessage = { projectId: this.projectId, pageId: this.pageId, user: this.userId, command: command, content: content };
    this.stompClient.send('/app/send', {}, JSON.stringify(message));
    console.log('send: ' + JSON.stringify(message));
  }

  disconnect() {
    this.stompClient.disconnect();
  }

  logMessage(message: String) {
    console.log(message);
  }
}
