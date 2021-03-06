import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageUserModalComponent } from '../shared/components/manage-user-modal/manage-user-modal.component';
import { RenameProjectModalComponent } from '../shared/components/rename-project-modal/rename-project-modal.component';
import { DeleteProjectModalComponent } from '../shared/components/delete-project-modal/delete-project-modal.component';
import { UserModalComponent } from '../shared/components/user-modal/user-modal.component';
import { Project } from '../shared/models/Project';
import { Invite } from '../shared/models/Invite';
import { ProjectService } from '../shared/services/project.service';
import { DataService } from '../data.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { InviteService } from '../shared/services/invite.service';
import { AuthService } from '../auth/auth.service';
import { AuthLogoutInfo } from '../auth/logout-info';
import { NotificationService } from '../shared/services/notification.service';
import { isArray } from 'util';
import { SocketConnectionService } from '../socketConnection/socket-connection.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  faEllipsisV = faEllipsisV;

  projects: Project[] = [
  ];

  invites: Invite[] = [
  ];

  info: any;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private projectService: ProjectService,
    private inviteService: InviteService,
    private tokenStorage: TokenStorageService,
    private data: DataService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private socketService: SocketConnectionService
  ) { }

  ngOnInit() {
    this.loadProjects();
    this.loadInvites();
    this.loadUserInfo();
  }

  connectToSocket() {  }

  sendMessageToSocket(){
    this.socketService.send('hallo','EDIT');
  }

  disconnectSocket(){
    this.socketService.disconnect();
  }

  loadUserInfo(): void {
    this.data.currentMessage.subscribe(item => {
      this.info = {
        token: this.tokenStorage.getToken(),
        username: this.tokenStorage.getUsername(),
      };
    });
  }

  onLogout() {
    // this.api.logout(this.currUser.email);
    this.authService.logout(new AuthLogoutInfo(this.tokenStorage.getEmail())).subscribe(
      data => {
        this.tokenStorage.signOut();
        this.router.navigate(['']);
      }
    );
  }

  loadProjects(): void {
    this.projectService.getProjects<Project[]>()
    .subscribe(
      (response) => {
        //console.log(response);
        this.projects = response;
      },
      (error) => {
        //console.error(error);
        this.notificationService.showError('Please try again by refreshing page.', 'Error: Could not load project.');
      }
    );
  }

  loadInvites(): void {
    this.inviteService.getInvites()
      .subscribe(
        (response) => {
          //console.log(`loadInvites: ${JSON.stringify(response)}`);
          let invites = (response as Invite[]);

          if (!isArray(invites)) {
            invites = [];
          }

          this.invites = invites;
        },
        (error) => {
          this.notificationService.showError('Please try again by refreshing page', 'ERROR: Could not load invites');
        }
    );
  }

  deleteProject(project: Project): void {
    this.projects.splice(this.projects.indexOf(project), 1);
  }

  /**
   * Invites
   */
  acceptInvite(invite: Invite): void {
    this.inviteService.acceptInvite(invite).subscribe(
      () => {
        this.invites.splice(this.invites.indexOf(invite), 1);
        //Reload projects
        this.loadProjects();
      },
      (error) => {
        this.notificationService.showError(`Error: ${error}`, 'Error');
      }
    );
  }

  declineInvite(invite: Invite): void {
    this.inviteService.declineInvite(invite).subscribe(
      () => {
        this.invites.splice(this.invites.indexOf(invite), 1);
        //Reload projects
        this.loadProjects();
      }
    );
  }

  /**
   * Projects
   */
  onCreateProject(project: Project) {

  }

  onOpenProject(project: Project) {
    this.projectService.setActiveProject(project);
    this.router.navigate(['editor']);
  }

  onManageUser(project: Project) {
    // alert(JSON.stringify(project));
    const modelRef = this.modalService.open(ManageUserModalComponent);
    modelRef.componentInstance.project = project;
    modelRef.componentInstance.confirm.subscribe(() =>
      this.loadProjects()
    );
  }

  onRenameProject(project: Project) {
    const modelRef = this.modalService.open(RenameProjectModalComponent);
    modelRef.componentInstance.project = project;
  }

  onDeleteProject(project: Project) {
    const modelRef = this.modalService.open(DeleteProjectModalComponent);
    modelRef.componentInstance.project = project;
    modelRef.componentInstance.confirm.subscribe(() =>
      this.deleteProject(project)
    );
  }

  onAcceptInvite(invite: Invite) {
    this.acceptInvite(invite);
  }

  onDeclineInvite(invite: Invite) {
    this.declineInvite(invite);
  }

  onEditProfile() {
    //console.log('clicked oneditProfile');
    const modelRef = this.modalService.open(UserModalComponent);
    modelRef.result.then((result) => {
      if ( result === 'success' ) {
        this.info.username = this.tokenStorage.getUsername();
      }
    }, (reason) => {

    });
  }
}
