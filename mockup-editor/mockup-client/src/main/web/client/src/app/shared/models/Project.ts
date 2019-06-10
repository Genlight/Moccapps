import { User } from './User';
import { Invite } from './Invite';

export class Project {
    id: number;
    projectname: string;
    private _lastEdited?: Date;
    users?: User[];
    invitations: Invite[];

    get lastEdited(): Date {
        return this._lastEdited || new Date();
    }

    set lastEdited(value: Date) {
        this._lastEdited = value;
    }
}
