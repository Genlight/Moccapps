import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { socketMessage } from './socketMessage';
import { FabricmodifyService } from '../editor/fabricmodify.service';
import { ManagePagesService } from '../editor/managepages.service';

@Injectable({
  providedIn: 'root'
})
export class SocketConnectionService {

  private stompClient: any = null;
  private projectId: string;
  private pageId: string;
  private userId: string;

  constructor(
    private modifyService:FabricmodifyService,
  ) { }

  connect(projectId: string, pageId: string, userId: string, callback:(message:socketMessage)=>void,that:any) {
    console.log('connection test\ncallback: '+JSON.stringify(callback)+"\ncallee:");
    this.userId = userId;
    this.projectId = projectId;
    this.pageId = pageId;
    const socket = new SockJS('http://localhost:8090/connect');
    this.stompClient = Stomp.over(socket);
    const _this = this;
    this.stompClient.connect({}, function (frame) {
      _this.stompClient.subscribe('/user/' + userId + '/queue/send', function (message) {
        callback.bind(that)(JSON.parse(message.body,/*_this.logMessage*/));
      });
      console.log('Connected: ' + frame);
    });
  }

  send(content: string, command: string) {
    let message: socketMessage = { projectId: this.projectId, pageId: this.pageId, user: this.userId, command: command, content: content };
    //this if is a temporary fix, can technically be removed once the persitence works but doesn't hurt either
    if(this.stompClient) {
      this.stompClient.send('/app/send', {}, JSON.stringify(message));
      console.log('send: ' + JSON.stringify(message));
    }
  }

  disconnect() {
    if(this.stompClient) this.stompClient.disconnect();
  }

  logMessage(message: String) {
    console.log('parsing: '+ message);
  }
}
