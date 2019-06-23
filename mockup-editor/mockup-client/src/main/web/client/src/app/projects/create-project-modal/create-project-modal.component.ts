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

  isProjectNameInvalid = false;
  isDimensionsInvalid = false;

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

    this.isProjectNameInvalid = false;
    this.isDimensionsInvalid = false;
  }

  openModal(content) {
    this.modal = this.modalService.open(content);
    this.modal.result.then(
      (result) => {
        //console.log(`Closed create project modal dialog. ${result}`);
      }, (reason) => {
        //console.log(`Dismissed create project modal dialog. ${reason}`);
      }
    );
  }

  onNameChanged() {
    if (this.project.name.length <= 0) {
      this.isProjectNameInvalid = true;
    } else {
      this.isProjectNameInvalid = false;
    }
  }

  onDimensionChanged() {
    if (this.project.height <= 0 || this.project.width <= 0 || this.project.height > 3000 || this.project.width > 3000) {
      this.isDimensionsInvalid = true;
    } else {
      this.isDimensionsInvalid = false;
    }
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
      this.isProjectNameInvalid = true;
      return;
    } 

    if (this.project.height <= 0 || this.project.width <= 0 || this.project.height > 3000 || this.project.width > 3000) {
      this.notificationService.showError('Project canvas size must between 0-3000 px.', 'Error');
      this.isDimensionsInvalid = true;
      return;
    }
    this.projectService.createProject(project).subscribe(
      res => {
        //console.log('HTTP response', res);
        let responseProject = (res as Project);
        if (!!responseProject) {
          // Create intitial page of project.
          this.pagesService.addPageWithREST(responseProject, null, this.project.height, this.project.width);
          this.projectService.setActiveProject(responseProject);
          this.modal.close();
          setTimeout(() => {
            this.router.navigate(['editor']);
          }, 1000);
        }
      },
      err => {
        //console.log('HTTP Error', err);
        this.modal.close();
      }
    );
  }
}
