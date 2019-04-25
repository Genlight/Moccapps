import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-create-project-modal',
  templateUrl: './create-project-modal.component.html',
  styleUrls: ['./create-project-modal.component.scss']
})
export class CreateProjectModalComponent implements OnInit {

  constructor(private modalService: NgbModal, private projectService: ProjectService) { 

  }

  ngOnInit() {
  }

  openModal(content) {
    this.modalService.open(content);
  }
}
