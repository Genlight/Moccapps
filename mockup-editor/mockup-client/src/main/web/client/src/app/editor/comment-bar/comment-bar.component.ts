import {Component, OnInit} from '@angular/core';
import {Comment} from '../../shared/models/comments';
import {CommentService} from '../comment.service';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {WorkspaceService} from '../workspace.service';
import {ManagePagesService} from "../managepages.service";

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

  constructor(private commentService: CommentService,
              private workspaceService: WorkspaceService,
              private pageService: ManagePagesService) {this.pageService.activePage.subscribe(
      (value) => {
        if(value == null){
          console.log("page null");
        }else{
          //this.getComments();
        }

      }
    )
    // ,
    this.commentService.commentSubjectTest.subscribe(
      (value) => {
        console.log("Comment-bar: commentSubject:" + value);
        this.comments = value;
      }
    )
  }

  ngOnInit() {
    this.initCommentservice();
    this.workspaceService.showsComments.subscribe((value) => {
      this.showsComponent = value;
    });
  }

  initCommentservice() {
    this.commentService.getAddCommentObs().subscribe(
      (bool) => {
        this.addingNewComment = bool;
      }
    );
  }

  getComments() {
    this.commentService.getComments().subscribe(
      (data) => {
        console.log(`applying comments: ${JSON.stringify(data)}`);
        if (Array.isArray(data)) {
          this.comments = data;
        } else {
          this.comments = [data];
        }
      }
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

  onTestButton() {
    this.commentService.testgetComments();
  }
}
