import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-rename-project-modal',
  templateUrl: './rename-project-modal.component.html',
  styleUrls: ['./rename-project-modal.component.scss']
})
export class RenameProjectModalComponent implements OnInit {

  project: Project;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  onSaveChange() {

  }
}
