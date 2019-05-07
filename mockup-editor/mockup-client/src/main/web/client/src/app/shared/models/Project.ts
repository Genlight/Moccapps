import { User } from './User';

export class Project {
    id: number;
    projectname: string;
    private _lastEdited?: Date;
    users?: User[];
    invitedUsers?: User[];

    get lastEdited(): Date {
        alert(this._lastEdited);
        return this._lastEdited || new Date();
    }

    set lastEdited(value: Date) {
        this._lastEdited = value;
    }
}
