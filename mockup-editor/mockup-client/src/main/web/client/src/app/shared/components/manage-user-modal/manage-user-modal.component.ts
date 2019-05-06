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
@Component({
  selector: 'app-manage-user-modal',
  templateUrl: './manage-user-modal.component.html',
  styleUrls: ['./manage-user-modal.component.scss']
})
export class ManageUserModalComponent implements OnInit {

  faEllipsisV = faEllipsisV;

  projectRef: Project;

  @Input()
  set project(project) {
    this.projectRef = project;
  }

  model: any;

  projectUsers: ManageUserItem[] = [
    {
      user: {
        id: 1,
        name: '',
        username: 'Mark4',
        email: 'mark@example.com'
      },
      hasInvite: false
    },
    {
      user: {
        id: 2,
        name: '',
        username: 'Mark5',
        email: 'mark@example.com'
      },
      hasInvite: false
    },
    {
      user: {
        id: 3,
        name: '',
        username: 'Mark6',
        email: 'mark@example.com'
      },
      hasInvite: true
    }
  ];

  invites: Invite[];

  constructor(
    public activeModal: NgbActiveModal,
    private notificationService: NotificationService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.loadProjectUsers();
  }

  loadProjectUsers() {
    if (!this.projectRef) {
      console.error('Project is null');
    }

    this.projectUsers = [];

    for (let user of this.projectRef.users) {
      this.projectUsers.push(
        new ManageUserItem(user)
      );
    }
  }

  onRemoveUserFromProject(user) {
    const index = this.projectUsers.indexOf(user);
    this.projectUsers.splice(index, 1);
  }

  onSelectUser(user) {
    console.log(user.item);
    this.addUser(user.item);
  }

  addUser(user: User) {
    let existingUsers: User[] = this.projectUsers.map(item => item.user);
    let matches = existingUsers.filter(u => (u.email === user.email));
    if (matches.length >= 1) {
      this.notificationService.showError('User already exists in project.');
      return;
    }

    this.projectUsers.push(
      new ManageUserItem(user)
    );
  }

  onApply() {
    alert(JSON.stringify(this.projectUsers));

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
}

export class ManageUserItem {
  constructor(user: User, invite?: Invite) {
    this.user = user;
    this.invite = invite;
  }

  user: User;
  invite?: Invite;
  get hasInvite(): boolean {
    return (!!this.invite);
  }
}
