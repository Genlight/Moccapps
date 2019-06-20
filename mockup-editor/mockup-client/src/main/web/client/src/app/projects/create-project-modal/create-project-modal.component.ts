import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/shared/services/project.service';
import { Project } from 'src/app/shared/models/Project';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ManagePagesService } from 'src/app/editor/managepages.service';

@Component({
  selector: 'app-create-project-modal',
  templateUrl: './create-project-modal.component.html',
  styleUrls: ['./create-project-modal.component.scss']
})
export class CreateProjectModalComponent implements OnInit {

  modal: NgbModalRef;
  project: {
    name: string,
    height: number,
    width: number
  };

  constructor(
    private modalService: NgbModal,
    private projectService: ProjectService,
    private pagesService: ManagePagesService,
    private router: Router,
    private notificationService: NotificationService) { 
  }

  ngOnInit() {
    this.resetValues();
  }

  private resetValues(): void {
    this.project = {
      name: 'My Project',
      height: 600,
      width: 900
    };
  }

  openModal(content) {
    this.modal = this.modalService.open(content);
    this.modal.result.then(
      (result) => {
        console.log(`Closed create project modal dialog. ${result}`);
      }, (reason) => {
        console.log(`Dismissed create project modal dialog. ${reason}`);
      }
    );
  }

  /**
   * Creates a new Project, initial page and sets the created project to active set.
   * @param value the 
   */
  onCreateProject(value: any): void {
    const project = new Project();
    project.projectname = this.project.name;

    if (this.project.name.length <= 0) {
      this.notificationService.showError('Project name must not be empty.', 'Error');
      return;
    } 

    if (this.project.height <= 0 || this.project.width <= 0) {
      this.notificationService.showError('Project canvas size must be larger than 0px.', 'Error');
      return;
    }
    this.projectService.createProject(project).subscribe(
      res => {
        console.log('HTTP response', res);
        let responseProject = (res as Project);
        if (!!responseProject) {
          // Create intitial page of project.
          this.pagesService.addPageWithREST(responseProject, null, this.project.height, this.project.width);
          this.projectService.setActiveProject(responseProject);
          this.modal.close();
          this.router.navigate(['editor']);
        }
      },
      err => {
        console.log('HTTP Error', err);
        this.modal.close();
      }
    );
  }
}
