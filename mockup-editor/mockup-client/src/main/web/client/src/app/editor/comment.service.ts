/**
 * author alexander Genser
 * @param  providedIn root
 */
import {Injectable} from "@angular/core";
import {ManagePagesService} from "./managepages.service";
import {Page} from "../shared/models/Page";
import {BehaviorSubject, Observable} from "rxjs";
import {TokenStorageService} from "../auth/token-storage.service";
import {SocketConnectionService} from "../socketConnection/socket-connection.service";
import {ApiService} from "../api.service";
import {Comment,CommentAction, CommentEntry} from "../shared/models/comments";
import {Action} from "./fabric-canvas/transformation.interface";
import {User} from "../shared/models/User";
import {UUID} from "angular2-uuid";
import {isArray} from "util";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  // test
  testcount;
  // actual active Page, get Comments from there
  activePage: Page;
  commentSubjectTest: BehaviorSubject<Comment[]>;
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
    this.commentSubjectTest = new BehaviorSubject<Comment[]>([]);
    this.comments = [];
    this.pageService.commentSubject.subscribe(
      (data) => {
        if (!data) { return; }
        console.log("commentSubjectCOMMENT:"+data.comment);
        //CommentAction (comment:added) ([object Object]) (undefined)
        if(data.action !== null)
        {
          console.log("commentSubjectCOMMENT  action:"+data.action);
        }
        if (data.comment !==null) {
          console.log("commentSubjectCOMMENT  comment:"+data.comment.toString()+" isArray:"+isArray(data.comment));
        }
        if(data.entry!==null){
          console.log('commentSubjectCOMMENT, entry: '+data.entry);
        }


        //this.getCommentsImpl();
        let comment: Comment;
        let index;
        switch (data.action) {
          case Action.COMMENTADDED:
            this.comments.push(data.comment);
            this.commentSubjectTest.next(this.comments);
            break;
          case Action.COMMENTMODIFIED:
            console.error(`action not implemented. (${data.action})`);
            break;
          case Action.COMMENTCLEARED:
            comment = this.comments.find((o) => o.uuid === data.comment.uuid);
            comment.isCleared = true;
            break;
          case Action.COMMENTENTRYADDED:
            comment = this.comments.find((o) => o.uuid === data.comment.uuid);
            comment.entries.push(data.entry);
            this.commentSubjectTest.next(this.comments);
            break;
          case Action.COMMENTENTRYDELETED:
            comment = this.comments.find((o) => o.uuid === data.comment.uuid);
            index = comment.entries.findIndex((o) => o.id === data.entry.id);
            comment.entries.splice(index, 1);
            this.commentSubjectTest.next(this.comments);
            break;
          case Action.COMMENTENTRYMODIFIED:
            comment = this.comments.find((o) => o.uuid === data.comment.uuid);
            let ent = comment.entries.find((o) => o.id === data.entry.id);
            ent = data.entry;
            this.commentSubjectTest.next(this.comments);
            break;
          default:
            console.log("default:"+data);
            break
            }
      }
        );

        this.addingComment = new BehaviorSubject<boolean>(false);
        console.log('CommentService init');
        this.pageService.activePage.subscribe((page) => {
          if (!page) { return; }
          console.log("activePageCOMMENT:"+page);
          this.activePage = page;
          this.getCommentsImpl();
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

  getCommentsImpl() {
    this.getComments().subscribe(
      (data) => {
        if (Array.isArray(data)) {
          this.comments = data;
        } else {
          this.comments = [data];
        }
        this.commentSubjectTest.next(this.comments);
      }
    );
  }

  createNewEntry( comment: Comment, newEntry: CommentEntry) {
    comment.entries.push(newEntry);
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
    this.commentSubjectTest.next(this.comments);
  }

  clearComment(comment: Comment) {
    comment.isCleared = true;
    const content = {comment};
    const command = Action.COMMENTCLEARED;
    console.log(`${command}`);
    this.socketService.send(JSON.stringify(content), command);

  }

  //
  updateComment(comment: Comment) {
    const content = {comment};
    const command = Action.COMMENTMODIFIED;
    console.log(`${command} : ${content.comment }`);
    this.socketService.send(JSON.stringify(content), command);
    this.commentSubjectTest.next(this.comments);
  }

  updateCommentEntry(comment: Comment, entry: CommentEntry) {
    const content = {comment, entry};
    const command = Action.COMMENTENTRYMODIFIED;
    console.log(`${command} : ${content.comment }: ID: ${entry.id}, Entrymessage: '${entry.message}'`);
    this.socketService.send(JSON.stringify(content), command);
    this.commentSubjectTest.next(this.comments);
  }

  deleteCommentEntry(comment: Comment, entry: CommentEntry) {
    const content = {comment};
    const command = Action.COMMENTENTRYDELETED;
    console.log(`${command}`);
    //this.socketService.send(JSON.stringify(content), command);
  }

  // deleteComment(comment: Comment) {
  //   const content = {comment};
  //   const command = 'comment:deleted';
  //   console.log(`${command}`);
  //   this.removeComment(comment);
  //   this.socketService.send(JSON.stringify(content), command);
  // }


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

  applyCommentAction(comAction: CommentAction) {
    console.log('applyCommentAction, Action: ' + comAction.action.toString()+" comment:"+comAction.comment.toString()+" entry:"+comAction.entry.toString());

    /*if (!comAction) { return; }
    this.getCommentsImpl();
    let comment: Comment;
    let index;
    switch (comAction.action) {
      case Action.COMMENTADDED:
        this.comments.push(comAction.comment);
        this.commentSubjectTest.next(this.comments);
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
        this.commentSubjectTest.next(this.comments);
        break;
      case Action.COMMENTENTRYDELETED:
        comment = this.comments.find((o) => o.uuid === comAction.comment.uuid);
        index = comment.entries.findIndex((o) => o.id === comAction.entry.id);
        comment.entries.splice(index, 1);
        this.commentSubjectTest.next(this.comments);
        break;
      case Action.COMMENTENTRYMODIFIED:
        comment = this.comments.find((o) => o.uuid === comAction.comment.uuid);
        let ent = comment.entries.find((o) => o.id === comAction.entry.id);
        ent = comAction.entry;
        this.commentSubjectTest.next(this.comments);
        break;
    }*/
  }

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
