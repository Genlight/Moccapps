/**
 * author alexander Genser
 * @param  providedIn root
 */
import {Injectable} from '@angular/core';
import { User } from '../shared/models/User';
import { Observable, of, BehaviorSubject } from 'rxjs';
import {Comment, CommentEntry } from '../shared/models/comments';
import { Page } from '../shared/models/Page';
import { TokenStorageService } from '../auth/token-storage.service';
import { ManagePagesService } from './managepages.service';
import { SocketConnectionService } from '../socketConnection/socket-connection.service';
import { UUID } from 'angular2-uuid';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  // test
  testcount;
  // actual active Page, get Comments from there
  activePage: Observable<Page>;
  commentSubject: BehaviorSubject<Comment[]>;
  comments: Comment[];
  // needed for buttons
  addingComment: BehaviorSubject<boolean>;
  constructor(
    private storageService: TokenStorageService,
    private pageService: ManagePagesService,
    private socketService: SocketConnectionService
  ) {
    this.testcount = false;
    this.commentSubject = new BehaviorSubject<Comment[]>([]);
    this.comments = [];
    this.activePage = this.pageService.getActivePage();
    // this.activePage.subscribe(
    //   page => {
    //     if (page.comments) {
    //       this.commentSubject.next(page.comments); }
    //     }
    // );
    this.addingComment = new BehaviorSubject<boolean>(false);
    console.log('CommentService init');
  }
  /**
   * for testing comments, will be deleted after persistening of comments
   * @return [description]
   */
  getComments(): Observable<Comment[]> {
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
  }

  createNewEntry( comment: Comment, newEntry: CommentEntry) {
    const content = {
      comment,
      entry: newEntry
    };
    const command = 'commententry:added';
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
      author,
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
    const command = 'comment:added';
    console.log(`${command}`);
    this.socketService.send(JSON.stringify(content), command);
    this.comments.push(comment);
    this.commentSubject.next(this.comments);
  }

  clearComment(comment: Comment) {
    comment.isCleared = true;
    const content = {comment};
    const command = 'comment:cleared';
    console.log(`${command}`);
    this.socketService.send(JSON.stringify(content), command);

  }

  updateComment(comment: Comment) {
    const content = {comment};
    const command = 'comment:modified';
    console.log(`${command} : ${content.comment }`);
    this.socketService.send(JSON.stringify(content), command);
    // this.commentSubject.next(this.comments);
  }

  updateCommentEntry(comment: Comment, entry: CommentEntry) {
    const content = {comment, entry};
    const command = 'commententry:modified';
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
    const command = 'commententry:deleted';
    console.log(`${command}`);
    this.socketService.send(JSON.stringify(content), command);
  }
  /**
   * not in use, only resolving / clearing a comment is currently supported
   * @param  comment Commment
   * @return         void
   */
  deleteComment(comment: Comment) {
    const content = {comment};
    const command = 'comment:deleted';
    console.log(`${command}`);
    this.removeComment(comment);
    this.socketService.send(JSON.stringify(content), command);
  }

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
   * testbutton action, to check whether getcomment works
   */
  testgetComments() {
    this.getComments();
  }
}
