import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Observable, of } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { Project } from '../../models/Project';
import { Invite } from '../../models/Invite';
import { NotificationService } from '../../services/notification.service';
import { isUndefined } from 'util';
import { ProjectService } from '../../services/project.service';
import { ProjectUpdateRequest } from '../../api/request/project-update-request';
@Component({
  selector: 'app-manage-user-modal',
  templateUrl: './manage-user-modal.component.html',
  styleUrls: ['./manage-user-modal.component.scss']
})
export class ManageUserModalComponent implements OnInit {

  faEllipsisV = faEllipsisV;

  projectRef: Project;

  invitedUsers: User[] = []; // List of who are/shall be invited to this project.
  projectUsers: User[] = []; // List of all users who are already users of this project.


  @Input()
  set project(project: Project) {
    this.projectRef = project;
  }

  model: any;

  manageUserList: ManageUserItem[] = [
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private notificationService: NotificationService,
    private userService: UserService,
    private projectService: ProjectService,
  ) { }

  ngOnInit() {
    this.resetView();
    this.loadProjectUsers();
  }

  resetView() {
    this.manageUserList = [];
  }

  loadProjectUsers() {
    if (this.projectRef == null) {
      console.error('Project reference is null');
    }

    //Create a copy of the users field.
    for (let user of (this.projectRef.users || [])) {
      this.projectUsers.push(user);
    }

    //Create a copy of the invited users field.
    for (let invitedUser of (this.projectRef.invitedUsers || [])) {
      this.invitedUsers.push(invitedUser);
    }

    //Add team members
    for (const user of this.projectUsers) {
      this.manageUserList.push(
        new ManageUserItem(user, TeamMemberStatus.Member)
      );
    }

    //Add invited members
    for (const user of this.invitedUsers) {
      this.manageUserList.push(
        new ManageUserItem(user, TeamMemberStatus.Invited)
      );
    }
  }

  onRemoveUserFromProject(listItem: ManageUserItem) {
    //Check if there is at least one team member left.
    let members: ManageUserItem[] = this.manageUserList.filter(i => (i.status === TeamMemberStatus.Member)); //all members
    if (members.length <= 1 && listItem.status === TeamMemberStatus.Member) {
      this.notificationService.showError('A project must have at least one team member', 'Remove unsuccessful');
      return;
    }

    const index = this.manageUserList.indexOf(listItem);
    this.manageUserList.splice(index, 1);

    if (listItem.status === TeamMemberStatus.Member) {
      const userIndex = this.projectUsers.indexOf(listItem.user);
      this.projectUsers.splice(userIndex, 1);
    } else {
      const userIndex = this.invitedUsers.indexOf(listItem.user);
      this.invitedUsers.splice(userIndex, 1);
    }
  }

  onSelectUser(user) {
    console.log(user.item);
    this.addNewUser(user.item);
  }

  addNewUser(user: User) {
    const existingUsers: User[] = this.manageUserList.map(item => item.user);
    const matches = existingUsers.filter(u => (u.email === user.email));
    if (matches.length >= 1) {
      this.notificationService.showError('User already exists in project.');
      return;
    }

    this.manageUserList.push(
      new ManageUserItem(user, TeamMemberStatus.Invited)
    );

    this.invitedUsers.push(user);
  }

  onApply() {
    //alert(JSON.stringify(this.projectClone));

    const requestProject = new Project();
    requestProject.id = this.projectRef.id;
    requestProject.projectname = this.projectRef.projectname;
    requestProject.invitedUsers = this.invitedUsers;
    requestProject.users = this.projectUsers;

    this.projectService.updateProject(requestProject).subscribe(
      (response) => {
        this.activeModal.close();
      },
      (error) => {
        this.notificationService.showError(error, 'ERROR');
      }
    );
  }

  /**
   * Typeahead search box
   */
  search(searchTerm) {
    return this.userService.searchUser(searchTerm).pipe(
      map((response) => {
        const jsonUsers = ((response as any).message);
        let users = JSON.parse(jsonUsers) as User[];
        return users;
      })
    );
  }

  searchUser = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      switchMap(term =>
        (term.length < 2) ? [] : this.search(term)
      )
    );
  }

  formatter = (user: any) => user.username;

  isTeamMember(teammember: TeamMemberStatus): boolean {
    if (teammember == TeamMemberStatus.Member) {
      return true;
    } else {
      return false;
    }
  }
}

/**
 * List item container for manage user item dialog.
 */
export class ManageUserItem {
  constructor(user: User, status: TeamMemberStatus, invite?: Invite) {
    this.user = user;
    this.invite = invite || undefined;
    this.status = status;
  }

  user: User;
  invite?: Invite;
  status: TeamMemberStatus;

  hasInvite(): boolean {
    return !isUndefined(this.invite);
  }
}


/**
 * Enum indicating the member status of the user in the current project.
 */
export enum TeamMemberStatus {
  Member,
  Invited,
}
