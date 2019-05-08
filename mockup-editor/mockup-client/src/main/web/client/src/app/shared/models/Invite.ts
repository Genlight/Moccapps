import {User} from "./User";
import {Project} from "./Project";

export class Invite {
  id: number;
  project: Project;
  inviter: User;
  invitee: User;
  status: number;
}
