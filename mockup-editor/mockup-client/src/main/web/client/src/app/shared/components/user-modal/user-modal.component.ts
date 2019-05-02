import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../models/User';
import { UserinfoService } from './userinfo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {

  modal: NgbModalRef;
  user: User;

  constructor(
    private modalService: NgbModal,
    private userInfoService: UserinfoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = this.userInfoService.getUserInfo();
  }
  openModal() {
    this.modal.result.then(
      (result) => {
        console.log(`Closed user info dialog with update to infos. ${result}`);
      }, (reason) => {
        console.log(`Dismissed user info modal dialog without changing infos. ${reason}`);
      }
    );
  }
  onUpdateUserInfo(value: any): void {
    this.userInfoService.setUserInfo(value.user);
    this.modal.close();
    this.router.navigate(['editor']);
  }

}
