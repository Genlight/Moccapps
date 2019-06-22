import { Component, OnInit, Input, ComponentFactoryResolver, ViewContainerRef, ReflectiveInjector } from '@angular/core';
import {Comment, CommentEntry, EntryEditing } from '../../shared/models/comments';
import { faEllipsisV, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../shared/models/User';
import { TokenStorageService } from '../../auth/token-storage.service';
import { SocketConnectionService } from '../../socketConnection/socket-connection.service';
import { CommentService } from '../comment.service';
import {UUID} from 'angular2-uuid';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  faEllipsisV = faEllipsisV;
  faPaperplane = faPaperPlane;

  initialEntry: CommentEntry;
  newEntry: CommentEntry;
  newEntryMessage: string;

  entryMessages: string;

  // entryEditing: EntryEditing;
  @Input() comment: Comment;
  currentUser: User;

  constructor(
    private storageService: TokenStorageService,
    private commentService: CommentService
    // private componentFactoryResolver: ComponentFactoryResolver,
    // private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit() {
    /*if(typeof this.comment !== 'undefined' && typeof this.comment.entries[0] !== 'undefined'){
      this.initialEntry = this.comment.entries[0];
    }
    else{*/
    this.initialEntry = new CommentEntry();
   // }
    this.currentUser = this.storageService.getUserInfo();
  }
  /**
   * Create new entry under the specified comment, send it per socket to Server
   * @param  event   event from component
   * @param  comment Comment
   */
  onCreateEntry() {
    // this.newEntry.id++;
    const ent = {
      email:  this.storageService.getEmail(),
      username:  this.storageService.getUsername(),
      message: this.newEntryMessage,
      date: new Date(),
      id: UUID.UUID(),
      isEditing: false
    };
    this.comment.entries.push(ent);
    this.newEntryMessage = '';
    this.commentService.createNewEntry(this.comment, ent);

    console.log('OnCreateEntry:' + JSON.stringify(this.comment) + ' | Entry' + JSON.stringify(ent));
  }
  /**
   * isCleared means, that a commment or the problem which is adressed has been isCleared
   * see also google docs comments for reference
   * @param  $event  event form component
   * @param  comment referenced comment
   */
  onIsCleared() {
    this.comment.isCleared = true;
    this.commentService.clearComment(this.comment);
  }
  /**
   * changed comment
   * @param  $event  event form component
   * @param  comment Comment
   */
  onChangeSubmit(entry) {
    entry.isEditing = false;
    entry.message = this.entryMessages;
    this.commentService.updateCommentEntry(this.comment, entry);
  }
  /**
   * delete a commententry from comment
   * @param  $event  [description]
   * @param  comment [description]
   */
  onDelete(entry) {
    const index = this.comment.entries.findIndex(obj => obj.id === entry.id);
    this.comment.entries.splice(index, 1);
    this.commentService.deleteCommentEntry(this.comment, entry);
  }

  /**
   * cleanup  * Comment
   * @return void
   */
  OnDestroy() {
  }
}
