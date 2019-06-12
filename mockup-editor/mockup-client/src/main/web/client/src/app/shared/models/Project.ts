import { User } from './User';
import { Invite } from './Invite';

export class Project {
    id: number;
    projectname: string;
    private _lastModified: Date;
    users?: User[];
    invitations: Invite[];

    get lastModified(): Date {
       return new Date(this._lastModified)
    }

    set lastModified(value: Date) {
        this.lastModified = value;
    }
}
