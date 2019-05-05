import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/Project';

@Component({
  selector: 'app-delete-project-modal',
  templateUrl: './delete-project-modal.component.html',
  styleUrls: ['./delete-project-modal.component.scss']
})
export class DeleteProjectModalComponent implements OnInit {

  projectName: string;
  private projectRef: Project;

  @Input()
  set project(project: Project) {
    this.projectName = project.projectname;
    this.projectRef = project;
  }
  
  @Output() 
  confirm: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public activeModal: NgbActiveModal, private projectService: ProjectService) { 
  }

  ngOnInit() {
  }

  onDeleteProject() {
    this.projectService.deleteProject(this.projectRef).subscribe((
      () => {   
        this.confirm.emit(true);
        this.activeModal.close();
      }
    ));
  }

}
