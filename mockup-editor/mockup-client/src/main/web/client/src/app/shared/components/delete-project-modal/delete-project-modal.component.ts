import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-project-modal',
  templateUrl: './delete-project-modal.component.html',
  styleUrls: ['./delete-project-modal.component.scss']
})
export class DeleteProjectModalComponent implements OnInit {

  project;

  constructor(private activeModal: NgbActiveModal) { 
  }

  ngOnInit() {
  }

}
