import { User } from './User';

export class Project {
    id: number;
    name: string;
    lastEdited?: Date;
    members: User[];
}
