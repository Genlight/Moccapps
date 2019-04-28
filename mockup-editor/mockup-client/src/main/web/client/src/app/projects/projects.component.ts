import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageUserModalComponent } from '../shared/components/manage-user-modal/manage-user-modal.component';
import { RenameProjectModalComponent } from '../shared/components/rename-project-modal/rename-project-modal.component';
import { DeleteProjectModalComponent } from '../shared/components/delete-project-modal/delete-project-modal.component';

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

  projects = [
    {
      name: 'Project 1',
      collaborators: [
        { username: 'User 1'},
        { username: 'user 2'}
      ],
      last_edited: new Date()
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

  constructor(private router: Router, private modalService: NgbModal) { 
  }

  ngOnInit() {        
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

  onManageUser(project) {
    //alert(JSON.stringify(project));
    this.modalService.open(ManageUserModalComponent);
  }

  onRenameProject(project) {
    this.modalService.open(RenameProjectModalComponent);
  }

  onDeleteProject(project) {
    this.modalService.open(DeleteProjectModalComponent);
  }

}
