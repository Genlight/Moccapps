import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Project } from '../../models/Project';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-rename-project-modal',
  templateUrl: './rename-project-modal.component.html',
  styleUrls: ['./rename-project-modal.component.scss']
})
export class RenameProjectModalComponent implements OnInit {

  projectName: string;
  projectRef: Project;

  @Output() 
  confirmed: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public activeModal: NgbActiveModal,
    private projectService: ProjectService  
  ) { }

  @Input()
  set project(project) {
    this.projectName = project.projectname;
    this.projectRef = project;
  }

  ngOnInit() {
  }

  onSaveChange() {
    this.projectRef.projectname = this.projectName;
    this.projectService.updateProject(this.projectRef).subscribe(
      (response) => {
        this.confirmed.emit(true);
        this.activeModal.close();
      }
    );
  }
}
