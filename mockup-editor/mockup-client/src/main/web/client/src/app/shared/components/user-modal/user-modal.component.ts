import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User, Pwd } from '../../models/User';
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
  pwd: Pwd;
  showPwdForm = false;
  constructor(
    private modalService: NgbModal,
    private userInfoService: UserinfoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = new User();
    this.userInfoService.getUserInfo()
      .subscribe((data: any) => this.user = {
        name:  data.name,
        email: data.email
    });
  }
  openModal(content) {
    this.modal = this.modalService.open(content);
    this.modal.result.then(
      (result) => {
        console.log(`Closed user info dialog with update to infos. ${result}`);
      }, (reason) => {
        console.log(`Dismissed user info modal dialog without changing infos. ${reason}`);
      }
    );
  }
  onUpdateUserInfo(value: any): void {
    this.userInfoService.updateUserInfo(value.user);
    this.modal.close();
    this.router.navigate(['editor']);
  }
  onUpdatePwd(value: any) {
      console.log('onUpdatePwd: ' + JSON.stringify(value));
      this.userInfoService.updatePassword(this.pwd);
      alert('Password changed successfully.');
      this.showPwdForm = !this.showPwdForm;
  }
  onPwdClick() {
    this.showPwdForm = !this.showPwdForm;
  }
}
