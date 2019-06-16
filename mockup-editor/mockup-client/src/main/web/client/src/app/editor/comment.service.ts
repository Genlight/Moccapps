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
  // actual active Page, get Comments from there
  activePage: Observable<Page>;
  commentSubject: BehaviorSubject<Comment[]>;
  comments: Comment[];
  constructor(
    private storageService: TokenStorageService,
    private pageService: ManagePagesService,
    private socketService: SocketConnectionService
  ) {
    this.commentSubject = new BehaviorSubject<Comment[]>([]);
    this.activePage = this.pageService.getActivePage();
    this.activePage.subscribe(
      page => {
        if (page.comments) {
          this.commentSubject.next(page.comments); }
        }
    );
  }
  /**
   * transformation from the activePage Observable to comment Observable
   * @param  comment Comment
   */
  private commentSubscription(comment: Comment[]) {
      this.commentSubject.next(comment);
  }

  getComments(): Observable<Comment[]> {
    const com = {
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
          message: 'something went wrong',
          id: 0,
          date: new Date(),
          isEditing: false
        },
        {
          author: {
            name: 'benny',
            username: 'benny travago',
            email: 'tothinkaout@as.com'
          },
          message: 'no it did not',
          id: 1,
          date: new Date(),
          isEditing: false
        },
        {
          author: this.storageService.getUserInfo(),
          message: 'no it did not',
          id: 2,
          date: new Date(),
          isEditing: false
        }
      ]
    };
    this.commentSubject.next([com]);
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
    const objectUuid = [];
    await objects.forEachObject( (obj) => { objectUuid.push(obj.uuid); });

    const entry = {
      author,
      message,
      date: new Date(),
      id: 0,
      isEditing: true
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
    this.commentSubject.next(this.comments);
  }

  deleteComment(comment: Comment) {
    const content = {comment};
    const command = 'comment:deleted';
    console.log(`${command}`);
    this.socketService.send(JSON.stringify(content), command);
  }

  deleteCommentEntry(comment: Comment, entry: CommentEntry) {
    const content = {comment};
    const command = 'commententry:deleted';
    console.log(`${command}`);
    this.socketService.send(JSON.stringify(content), command);
  }
}
