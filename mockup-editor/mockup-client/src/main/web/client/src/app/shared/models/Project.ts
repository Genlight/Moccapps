import { User } from './User';

export class Project {
    id: number;
    projectname: string;
    lastEdited?: Date;
    members: User[];
}
