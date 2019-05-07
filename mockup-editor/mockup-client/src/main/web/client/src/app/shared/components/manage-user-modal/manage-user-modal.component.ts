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
@Component({
  selector: 'app-manage-user-modal',
  templateUrl: './manage-user-modal.component.html',
  styleUrls: ['./manage-user-modal.component.scss']
})
export class ManageUserModalComponent implements OnInit {

  faEllipsisV = faEllipsisV;

  projectRef: Project;
  projectClone: Project;

  @Input()
  set project(project) {
    this.projectRef = project;
    this.projectClone = Object.assign({}, project);
  }

  model: any;

  manageUserList: ManageUserItem[] = [
    // {
    //   user: {
    //     id: 1,
    //     name: '',
    //     username: 'Mark4',
    //     email: 'mark@example.com'
    //   },
    //   invite = null
    // },
    // {
    //   user: {
    //     id: 2,
    //     name: '',
    //     username: 'Mark5',
    //     email: 'mark@example.com'
    //   }
    // },
    // {
    //   user: {
    //     id: 3,
    //     name: '',
    //     username: 'Mark6',
    //     email: 'mark@example.com'
    //   },
    //   hasInvite: true
    // }
  ];
  
  constructor(
    public activeModal: NgbActiveModal,
    private notificationService: NotificationService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.resetView();
    this.loadProjectUsers();
  }

  resetView() {
    this.manageUserList = [];
  }

  loadProjectUsers() {
    if (!this.projectClone) {
      console.error('Project is null');
    }

    //Add team members
    for (const user of this.projectClone.users) {
      this.manageUserList.push(
        new ManageUserItem(user, TeamMemberStatus.Member)
      );
    }

    //Add invited members
    for (const user of this.projectClone.invitedUsers) {
      this.manageUserList.push(
        new ManageUserItem(user, TeamMemberStatus.Invited)
      );
    }
  }

  onRemoveUserFromProject(listItem: ManageUserItem) {
    const index = this.manageUserList.indexOf(listItem);
    this.manageUserList.splice(index, 1);
    if (listItem.status === TeamMemberStatus.Member) {
      const userIndex = this.projectClone.users.indexOf(listItem.user);
      this.projectClone.users.splice(userIndex, 1);
    } else {
      const userIndex = this.projectClone.invitedUsers.indexOf(listItem.user);
      this.projectClone.users.splice(userIndex, 1);
    }
  }

  onSelectUser(user) {
    console.log(user.item);
    this.addNewUser(user.item);
  }

  addNewUser(user: User) {
    let existingUsers: User[] = this.manageUserList.map(item => item.user);
    let matches = existingUsers.filter(u => (u.email === user.email));
    if (matches.length >= 1) {
      this.notificationService.showError('User already exists in project.');
      return;
    }

    this.manageUserList.push(
      new ManageUserItem(user, TeamMemberStatus.Invited)
    );

    this.projectClone.invitedUsers.push(user);
  }

  onApply() {
    alert(JSON.stringify(this.projectClone));
    this.activeModal.close();
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
