import { User } from './User';
import { Action } from './Transformation';

export class Comment {
    objectUuid?: string[];
    isCleared = false;
    entries: CommentEntry[];
    uuid: string;
  public toString = () : string => {
    return `Comment (${this.uuid}) (${this.entries})`;
  }
}

export class CommentEntry {
  //author: User;
  email: string;
  username: string;
  //name:string;

  message: string;
  id: string;
  date: Date;
  isEditing ? = false;

  public toString = () : string => {
    return `CommentEntry (${this.email}) (${this.message})`;
  }
}

export class EntryEditing {
  entry: CommentEntry;
  isediting = false;
}

export class CommentAction {
  action: Action;
  comment: Comment;
  entry?: CommentEntry;
  public toString = () : string => {
    return `CommentAction (${this.action}) (${this.comment}) (${this.entry})`;
  }
}
