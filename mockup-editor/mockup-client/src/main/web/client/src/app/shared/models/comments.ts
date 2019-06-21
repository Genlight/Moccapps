import { User } from './User';
import { Action } from './Transformation';

export class Comment {
    objectUuid?: string[];
    isCleared = false;
    entries: CommentEntry[];
    uuid: string;
}

export class CommentEntry {
  author: User;
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
