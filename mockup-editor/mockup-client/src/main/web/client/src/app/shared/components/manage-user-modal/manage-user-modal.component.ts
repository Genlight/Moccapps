import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-user-modal',
  templateUrl: './manage-user-modal.component.html',
  styleUrls: ['./manage-user-modal.component.scss']
})
export class ManageUserModalComponent implements OnInit {

  name = 'World';

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
