/**
 * author alexander Genser
 * @param  providedIn root
 */
import {Injectable} from '@angular/core';
import { User } from '../shared/models/User';
import { Action } from '../shared/models/Transformation';
import { Observable, of, BehaviorSubject } from 'rxjs';
import {Comment, CommentEntry, CommentAction } from '../shared/models/comments';
import { Page } from '../shared/models/Page';
import { TokenStorageService } from '../auth/token-storage.service';
import { ManagePagesService } from './managepages.service';
import { SocketConnectionService } from '../socketConnection/socket-connection.service';
import { UUID } from 'angular2-uuid';
import {ApiService} from "../api.service";
import {isArray} from "util";
import {GroupPage} from "../shared/models/Group";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  // test
  testcount;
  // actual active Page, get Comments from there
  activePage: Page;
  commentSubject: BehaviorSubject<Comment[]>;
  comments: Comment[];
  // needed for buttons
  addingComment: BehaviorSubject<boolean>;
  constructor(
    private storageService: TokenStorageService,
    private pageService: ManagePagesService,
    private socketService: SocketConnectionService,
    private apiService: ApiService
  ) {
    this.testcount = false;
    this.commentSubject = new BehaviorSubject<Comment[]>([]);
    this.comments = [];
    this.pageService.getCommentActionObs().subscribe(
      (data) => { this.applyCommentAction(data); }
    );
    this.addingComment = new BehaviorSubject<boolean>(false);
    console.log('CommentService init');
    this.pageService.activePage.subscribe((page) => {
      this.activePage = page;
    });
  }
  /**
   * for testing comments, will be deleted after persistening of comments
   * @return  Observable<Comment[]>
   */
  getComments(): Observable<Comment[]> {
    console.log("getComments called:"+`/page/${this.activePage.id}/comments`);
    return this.apiService.get<Comment[]>(`/page/${this.activePage.id}/comments`);
  }

  /*getComments(): Observable<Comment[]> {
    const com = {
      objectUuid: ['hjlk'],
      isCleared: false,
      uuid: 'uuidcom',
      entries: [
        {
          author: {
            name: 'jonny',
            username: 'jonny trave',
            email: 'tothinkabout@as.com'
          },
          message: 'something went wrong',
          id: 0,
          date: new Date(),
          isEditing: false
        }]};
    const com2 = {
      objectUuid: ['asdf'],
      isCleared: false,
      uuid: 'uuidcomment',
      entries: [
        {
          author: {
            name: 'jonny',
            username: 'jonny trave',
            email: 'tothinkabout@as.com'
          },
          message: 'hello there',
          id: 0,
          date: new Date(),
          isEditing: false
        },
        {
          author: {
            name: 'jonny',
            username: 'jonny trave',
            email: 'tothinkabout@as.com'
          },
          message: 'sa something',
          id: 0,
          date: new Date(),
          isEditing: false
        }]};
    this.testcount = !this.testcount;
    if (this.testcount) {
      this.commentSubject.next([com]);
    } else {
      this.commentSubject.next([com2]);
    }
    return this.commentSubject.asObservable();
  }*/

  createNewEntry( comment: Comment, newEntry: CommentEntry) {
    const content = {
      comment,
      entry: newEntry
    };
    const command = Action.COMMENTENTRYADDED;
    console.log(`${command} | new entry: ${content.entry }`);
    this.socketService.send(JSON.stringify(content), command);
  }

  async addComment(message: string, author: User = this.storageService.getUserInfo()) {
    const canvas = this.pageService.getCanvas();
    const objects = canvas.getActiveObject();

    console.log(`addingComment: active objects : ${JSON.stringify(objects)}`);

    const objectUuid = [];
    if (!!objects) {
      if (Array.isArray(objects)) {
        for (const obj of objects) {
          objectUuid.push(obj.uuid);
        }
      } else {
        objectUuid.push(objects.uuid);
      }
    }
    const entry = {
      email:this.storageService.getUserInfo().email,
      username:this.storageService.getUserInfo().username,
      message,
      date: new Date(),
      id: 0,
      isEditing: false
    };
    const comment = {
      uuid: UUID.UUID(),
      entries: [entry],
      isCleared: false,
      objectUuid
    };
    const content = {comment};
    const command = Action.COMMENTADDED;
    console.log(`${command}`);
    this.socketService.send(JSON.stringify(content), command);
    this.comments.push(comment);
    this.commentSubject.next(this.comments);
  }

  clearComment(comment: Comment) {
    comment.isCleared = true;
    const content = {comment};
    const command = Action.COMMENTCLEARED;
    console.log(`${command}`);
    this.socketService.send(JSON.stringify(content), command);

  }

  updateComment(comment: Comment) {
    const content = {comment};
    const command = Action.COMMENTMODIFIED;
    console.log(`${command} : ${content.comment }`);
    this.socketService.send(JSON.stringify(content), command);
    // this.commentSubject.next(this.comments);
  }

  updateCommentEntry(comment: Comment, entry: CommentEntry) {
    const content = {comment, entry};
    const command = Action.COMMENTENTRYMODIFIED;
    console.log(`${command} : ${content.comment }: ID: ${entry.id}, Entrymessage: '${entry.message}'`);
    this.socketService.send(JSON.stringify(content), command);
    // this.commentSubject.next(this.comments);
  }
  /**
   * deleting an existing CommentEntry
   * @param  comment Comment
   * @param  entry   CommentEntry
   * @return         void
   */
  deleteCommentEntry(comment: Comment, entry: CommentEntry) {
    const content = {comment};
    const command = Action.COMMENTENTRYDELETED;
    console.log(`${command}`);
    this.socketService.send(JSON.stringify(content), command);
  }
  /**
   * not in use, only resolving / clearing a comment is currently supported
   * @param  comment Commment
   * @return         void
   */
  // deleteComment(comment: Comment) {
  //   const content = {comment};
  //   const command = 'comment:deleted';
  //   console.log(`${command}`);
  //   this.removeComment(comment);
  //   this.socketService.send(JSON.stringify(content), command);
  // }

  /**
   * needed for buttons and showing comment tab
   * @return Observable<boolean>
   */
  getAddCommentObs(): Observable<boolean> {
    return this.addingComment.asObservable();
  }

  setAddCommentObs(bool: boolean) {
    this.addingComment.next(bool);
  }

  getCommentByUUID(comment: Comment) {
    return this.comments.find( (o) => o.uuid === comment.uuid  );
  }

  // removing an existing comment from the comment array
  removeComment(comment: Comment) {
    const del = this.comments.findIndex(obj => obj.uuid === comment.uuid);
    this.comments.splice(del, 1);
  }
  /**
   * applies Changes comming through websocket-connection
   * @param  comAction CommentAction
   * @return           void
   */
  applyCommentAction(comAction: CommentAction) {
    if (!comAction) { return; }
    console.log('applyCommentAction, Action: ' + comAction.action);
    let comment: Comment;
    let index;
    switch (comAction.action) {
      case Action.COMMENTADDED:
        this.comments.push(comAction.comment);
        this.commentSubject.next(this.comments);
        break;
      case Action.COMMENTMODIFIED:
        console.error(`action not implemented. (${comAction.action})`);
        break;
      case Action.COMMENTCLEARED:
        comment = this.comments.find((o) => o.uuid === comAction.comment.uuid);
        comment.isCleared = true;
        break;
      case Action.COMMENTENTRYADDED:
        comment = this.comments.find((o) => o.uuid === comAction.comment.uuid);
        comment.entries.push(comAction.entry);
        this.commentSubject.next(this.comments);
        break;
      case Action.COMMENTENTRYDELETED:
        comment = this.comments.find((o) => o.uuid === comAction.comment.uuid);
        index = comment.entries.findIndex((o) => o.id === comAction.entry.id);
        comment.entries.splice(index, 1);
        this.commentSubject.next(this.comments);
        break;
      case Action.COMMENTENTRYMODIFIED:
        comment = this.comments.find((o) => o.uuid === comAction.comment.uuid);
        let ent = comment.entries.find((o) => o.id === comAction.entry.id);
        ent = comAction.entry;
        this.commentSubject.next(this.comments);
        break;
    }
  }
  /**
   * testbutton action, to check whether getcomment works
   */
  testgetComments() {
    this.getComments().subscribe(
      (data) => {
        console.log("Got commtents");
        if (Array.isArray(data)) {
          this.comments = data;
          console.log("Got commtents is array:"+(data as Comment[]));
          data.forEach(function (value) {
            console.log(value);
            console.log((value as Comment));
          });
        } else {
          this.comments = [data];
          console.log("Got commtents:"+data);
        }
      }
    );
  }
}
