import { Project } from './Project';
import { User } from './User';

export class Invite {
    id: number;
    project: Project;
    inviter: User;	//The user who sent the invite
    invited: User;
}
