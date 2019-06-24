import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { socketMessage } from './socketMessage';
import { FabricmodifyService } from '../editor/fabricmodify.service';
import { ManagePagesService } from '../editor/managepages.service';
import {environment} from "../../environments/environment";
import pako from 'pako';

const API_URL = environment.apiUrl;

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
    //console.log('connection test\ncallback: '+JSON.stringify(callback)+"\ncallee:");
    this.userId = userId;
    this.projectId = projectId;
    this.pageId = pageId;
    const socket = new SockJS(API_URL+'/connect');
    this.stompClient = Stomp.over(socket);
    const _this = this;
    this.stompClient.debug = () => {};
    this.stompClient.connect({}, (frame) => {
      _this.stompClient.subscribe('/user/' + userId + '/queue/send', function (message) {
        callback.bind(that)(JSON.parse(message.body,/*_this.logMessage*/),/*_this.logMessage*/);
        //callback.bind(that)(JSON.parse(pako.inflate(atob(message.body)),/*_this.logMessage*/),/*_this.logMessage*/);
        //console.log("unbase64:"+atob(message.body));
        //console.log("uncompress:"+pako.inflate(atob(message.body)));
        //console.log("json:"+JSON.parse(pako.inflate(atob(message.body))));
        //var temp  =Buffer.from(pako.inflate(atob(message.body)));
        //console.log("test:"+temp.toString());
      });
      //console.log('Connected: ' + frame);

      //Load page
    });
  }

  send(content: string, command: string) {
    let message: socketMessage = { projectId: this.projectId, pageId: this.pageId, user: this.userId, command: command, content: content };
    //this if is a temporary fix, can technically be removed once the persitence works but doesn't hurt either
    if(this.stompClient) {
      var json = JSON.stringify(message);
      var deflateString = pako.deflate(json,{ to: 'string' });
      var base64 = btoa(deflateString);
      this.stompClient.send('/app/send', {},  base64);
      //console.log('send: ' + json);
    }
  }

  disconnect() {
    if(this.stompClient) this.stompClient.disconnect();
  }

  logMessage(message: String) {
    //console.log('parsing: '+ message);
  }
}
