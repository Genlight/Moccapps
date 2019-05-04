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

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  faEllipsisV = faEllipsisV;

  user = {
    username: 'Max Mustermann'
  };

  projects: Project[] = [
    {
      id: 1,
      name: 'Project 1',
      members: [
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
  ];

  invitedProject = [
    {
      name: 'Super project',
      invited_by: {
        username: 'User 5'
      }
    },
    {
      name: 'Super project 2',
      invited_by: {
        username: 'User 5'
      }
    },
    {
      name: 'Super project 3',
      invited_by: {
        username: 'User 5'
      }
    }
  ];

  invites: Invite[] = [
    
  ];

  constructor(private router: Router, private modalService: NgbModal, private projectService: ProjectService) { 
  }

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects<Project[]>().subscribe(
      projects => {
        alert(projects);
      }
    );
  }

  deleteProject(project: Project) {
    this.projects.splice(this.projects.indexOf(project), 1);
  }

  /**
   * Projects 
   */
  onCreateNewProject() {
    this.router.navigate(['editor']);
  }

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

  onAcceptInvite(project) {
    // TODO
  }

  onDeclineInvite(project) {
    // TODO
  }
}
