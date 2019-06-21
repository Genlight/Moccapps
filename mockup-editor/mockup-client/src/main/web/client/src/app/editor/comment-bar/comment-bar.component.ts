import { Component, OnInit } from '@angular/core';
import {Comment, CommentEntry} from '../../shared/models/comments';
import { CommentService } from '../comment.service';
import {GroupPage} from "../../shared/models/Group";
import {User} from "../../shared/models/User";
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
    //this.initCommentservice();
  }

  initCommentservice() {
    this.commentService.getAddCommentObs().subscribe(
    (bool) => { this.addingNewComment = bool; }
    );
    this.commentService.getComments().subscribe(
      (data) => {
        console.log("Got commtents:"+data);
        this.comments = (data as Comment[]);
        let temp: Comment[] = [];
        data.forEach(function (value) {
          console.log(value);
          console.log((value as Comment));
          var com = new Comment();
          com.uuid = value.uuid;
          com.isCleared = value.isCleared;
          let temp1: CommentEntry[] = [];
          value.entries.forEach(function (value) {

              //var usr = new User();
              //var aut = (value.author as User);

              var ent = new CommentEntry();
              ent.email = value.email;
              ent.username = value.username;

              ent.date=value.date;
              ent.id=value.id;
              ent.isEditing=false;
              ent.message=value.message;
              temp1.push(ent);
          });
          com.entries=temp1;
          com.objectUuid = value.objectUuid;
          temp.push(com);
        });
        this.comments = temp;
        console.log(temp);
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
  /**
   * test
   * @return void
   */
  onTestButton() {
    this.initCommentservice();
  }
}
