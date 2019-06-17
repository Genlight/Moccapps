import { Component, OnInit } from '@angular/core';
import {Comment, CommentEntry} from '../../shared/models/comments';
import { CommentService } from '../comment.service';
@Component({
  selector: 'app-comment-bar',
  templateUrl: './comment-bar.component.html',
  styleUrls: ['./comment-bar.component.scss']
})
export class CommentBarComponent implements OnInit {
  comments: Comment[];

  newComment: string;
  addingNewComment;
  constructor(private commentService: CommentService) {}

  ngOnInit() {
    this.initCommentservice();
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
    this.comments.push();
    this.newComment = '';
    this.addingNewComment = false;
  }
  /**
   * test
   * @return void
   */
  onTestButton() {
    this.commentService.testgetComments();
  }
}
