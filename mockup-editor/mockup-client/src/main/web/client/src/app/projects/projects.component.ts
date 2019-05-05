import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageUserModalComponent } from '../shared/components/manage-user-modal/manage-user-modal.component';
import { RenameProjectModalComponent } from '../shared/components/rename-project-modal/rename-project-modal.component';
import { DeleteProjectModalComponent } from '../shared/components/delete-project-modal/delete-project-modal.component';
import { Project } from '../shared/models/Project';
import { Invite } from '../shared/models/Invite';
import { ProjectService } from '../shared/services/project.service';
import { DataService } from '../data.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { InviteService } from '../shared/services/invite.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  faEllipsisV = faEllipsisV;

  projects: Project[] = [
/*     {
      id: 1,
      projectname: 'Project 1',
      users: [
        { 
          name: 'User 1',
          email: 'sadfasdf@asdf.com'
        },
        { 
          name: 'user 2',
          email: 'asdfdsa@sdafds.com'
        }
      ],
      lastEdited: new Date()
    }, */
  ];

  invites: Invite[] = [
    {
      id: 1,
      project: {
        id: 1,
        projectname: 'Project 1',
        users: [
          { 
            name: 'User 1',
            email: 'sadfasdf@asdf.com'
          },
          { 
            name: 'user 2',
            email: 'asdfdsa@sdafds.com'
          }
        ],
        lastEdited: new Date()
      },
      invited: { 
        name: 'User 1',
        email: 'sadfasdf@asdf.com'
      },
      inviter: {   
        name: 'User 1',
        email: 'sadfasdf@asdf.com'
      }
    }
  ];

  info: any;

  constructor(
    private router: Router, 
    private modalService: NgbModal, 
    private projectService: ProjectService,
    private inviteService: InviteService,
    private tokenStorage: TokenStorageService,
    private data: DataService
  ) { }

  ngOnInit() {
    this.loadProjects();
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    this.data.currentMessage.subscribe(item => {
      this.info = {
        token: this.tokenStorage.getToken(),
        username: this.tokenStorage.getUsername(),
      };
    });
  }

  loadProjects(): void {
    this.projectService.getProjects()
    .subscribe(
      (response) => {
        const jsonProjects = ((response as any).message);
        let projects = JSON.parse(jsonProjects) as Project[];
        for (let project of projects) {
          console.log(project);
        }
        this.projects = projects;
      }
    );
  }

  loadInvites(): void {
    this.projectService.getProjects()
    .subscribe(
      (response) => {
        const jsonInvites = ((response as any).message);
        let invites = JSON.parse(jsonInvites) as Invite[];
        for (let invite of invites) {
          console.log(invite);
        }
        this.invites = invites;
      }
    );
  }

  deleteProject(project: Project): void {
    this.projects.splice(this.projects.indexOf(project), 1);
  }

  acceptInvite(invite: Invite): void {
    this.inviteService.acceptInvite(invite).subscribe(
      () => {
        this.invites.splice(this.invites.indexOf(invite), 1);
      }
    );
  }

  declineInvite(invite: Invite): void {
    this.inviteService.declineInvite(invite).subscribe(
      () => {
        this.invites.splice(this.invites.indexOf(invite), 1);
      }
    );
  }

  /**
   * Projects 
   */
  onOpenProject() {
    this.router.navigate(['editor']);
  }

  onManageUser(project: Project) {
    // alert(JSON.stringify(project));
    const modelRef = this.modalService.open(ManageUserModalComponent);
    modelRef.componentInstance.project = project;
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
}
