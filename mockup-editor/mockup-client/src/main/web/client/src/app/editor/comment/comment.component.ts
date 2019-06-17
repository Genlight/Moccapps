import { Component, OnInit, Input, ComponentFactoryResolver, ViewContainerRef, ReflectiveInjector } from '@angular/core';
import {Comment, CommentEntry, EntryEditing } from '../../shared/models/comments';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../shared/models/User';
import { TokenStorageService } from '../../auth/token-storage.service';
import { SocketConnectionService } from '../../socketConnection/socket-connection.service';
import { CommentService } from '../comment.service';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  faEllipsisV = faEllipsisV;

  initialEntry: CommentEntry;
  newEntry: CommentEntry;
  newEntryMessage: string;

  entryMessages: string;

  // entryEditing: EntryEditing;
  @Input() comment: Comment;
  currentUser: User;

  constructor(
    private storageService: TokenStorageService,
    private commentService: CommentService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit() {
    this.initialEntry = this.comment.entries[0];
    this.currentUser = this.storageService.getUserInfo();
    this.newEntry = {
      author:  this.currentUser,
      message: '',
      date: new Date(),
      id: this.comment.entries.length
    };
  }
  /**
   * Create new entry under the specified comment, send it per socket to Server
   * @param  event   event from component
   * @param  comment Comment
   */
  onCreateEntry() {
    this.newEntry.id++;
    this.comment.entries.push({
      author:  this.currentUser,
      message: this.newEntry.message,
      date: new Date(),
      id: this.comment.entries.length,
      isEditing: false
    });
    this.newEntry.message = '';
    this.commentService.createNewEntry(this.comment, this.newEntry);
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
    this.commentService.updateComment(this.comment);
  }
  /**
   * delete a comment and remove comment from html
   * @param  $event  [description]
   * @param  comment [description]
   */
  onDelete(entry) {
    const ent = this.comment.entries.find(obj => obj.id === entry.id);
    this.commentService.deleteCommentEntry(this.comment, ent);
    this.OnDestroy();
  }

  /**
   * cleanup Comment
   * @return void
   */
  OnDestroy() {
  }
}
