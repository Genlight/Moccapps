import { User } from '../../models/User';

export class ProjectUpdateRequest {
    /**
     * Id  of the project
     */
    id: number;

    /**
     * Projectname the project
     */
    projectname: string;

    /**
     * Team members
     */
    users: User[];

    /**
     * List of all emails team members which are invited to this project. 
     */
    invitations: string[];
}