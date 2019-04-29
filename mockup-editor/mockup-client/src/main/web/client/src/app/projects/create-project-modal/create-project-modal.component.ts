import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/shared/services/project.service';
import { Project } from 'src/app/shared/models/Project';

@Component({
  selector: 'app-create-project-modal',
  templateUrl: './create-project-modal.component.html',
  styleUrls: ['./create-project-modal.component.scss']
})
export class CreateProjectModalComponent implements OnInit {

  modal: NgbModalRef;
  project: any;

  constructor(
    private modalService: NgbModal,
    private projectService: ProjectService,
    private router: Router) { 
  }

  ngOnInit() {
    this.resetValues();
  }

  private resetValues(): void {
    this.project = {
      name: 'My Project',
      height: 300,
      width: 150
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

  onCreateProject(value: any): void {
    //alert(JSON.stringify(value));

    const project = new Project();
    //TODO: Pass height/width to editor page
    //const project = new Project();
    //project.name = value.name;
    //this.projectService.createProject(project);
    this.modal.close();
    this.router.navigate(['editor']);
  }
}
