import { User } from './User';
import { Action } from './Transformation';

export class Comment {
    objectUuid?: string[];
    isCleared = false;
    entries: CommentEntry[];
    uuid: string;
}

export class CommentEntry {
  //author: User;
  email: string;
  username: string;
  //name:string;

  message: string;
  id: number;
  date: Date;
  isEditing ? = false;
}

export class EntryEditing {
  entry: CommentEntry;
  isediting = false;
}

export class CommentAction {
  action: Action;
  comment: Comment;
  entry?: CommentEntry;
}
