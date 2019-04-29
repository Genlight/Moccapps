import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Project } from '../../models/Project';

@Component({
  selector: 'app-rename-project-modal',
  templateUrl: './rename-project-modal.component.html',
  styleUrls: ['./rename-project-modal.component.scss']
})
export class RenameProjectModalComponent implements OnInit {

  private projectName: string;
  private projectRef: Project;

  @Output() 
  confirmed: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private activeModal: NgbActiveModal) { }

  @Input()
  set project(project) {
    this.projectName = project.name;
    this.projectRef = project;
  }

  ngOnInit() {
  }

  onSaveChange() {
    this.projectRef.name = this.projectName;
    this.confirmed.emit(true);
    this.activeModal.close();
  }
}
