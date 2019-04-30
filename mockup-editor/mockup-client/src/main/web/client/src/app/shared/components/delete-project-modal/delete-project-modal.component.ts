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

  private projectName: string;

  @Input()
  set project(project: Project) {
    this.projectName = project.name;
  }
  
  @Output() 
  confirm: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private activeModal: NgbActiveModal, private projectService: ProjectService) { 
  }

  ngOnInit() {
  }

  onDeleteProject() {
    // TODO
    // this.projectService.deleteProject(this.project);
    this.confirm.emit(true);
    this.activeModal.close();
  }

}
