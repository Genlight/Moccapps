import { Component, OnInit } from '@angular/core';
import {Comment, CommentEntry} from '../../shared/models/comments';
import { CommentService } from '../comment.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { WorkspaceService } from '../workspace.service';

@Component({
  selector: 'app-comment-bar',
  templateUrl: './comment-bar.component.html',
  styleUrls: ['./comment-bar.component.scss']
})
export class CommentBarComponent implements OnInit {
  comments: Comment[];

  newComment: string;

  showsComponent: boolean;
  addingNewComment;
  isLoading: boolean = false; 

  faTimes = faTimes;

  constructor(private commentService: CommentService, private workspaceService: WorkspaceService) {}

  ngOnInit() {
    this.initCommentservice();
    this.workspaceService.showsComments.subscribe((value) => {
      this.showsComponent = value;
    });
  }

  initCommentservice() {
    this.commentService.getAddCommentObs().subscribe(
    (bool) => { this.addingNewComment = bool; }
    );
    this.commentService.getComments().subscribe(
      (data) => {
        if (Array.isArray(data)) {
          this.comments = data;
        } else {
          this.comments = [data];
        }
      }
    );
    this.commentService.getAddCommentObs().subscribe(
      (bool) => { this.addingNewComment = bool; }
    );
  }
  // creating a comment on an exisiting
  onCreateComment() {
    this.addingNewComment = true;
  }

  onAddComment() {
    this.commentService.addComment(this.newComment);
    this.newComment = '';
    this.addingNewComment = false;
  }

  onClose() {
    this.workspaceService.hideComments();
  }

  /**
   * test
   * @return void
   */
  onTestButton() {
    this.commentService.testgetComments();
  }
}
