import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../models/User';
import { UserinfoService } from './userinfo.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {

  user: User;

  constructor(
    public activeModal: NgbActiveModal,
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
  onUpdateUserInfo(): void {
    this.userInfoService.updateUserInfo(this.user).subscribe(
      (data: any) => {
        if (data.message === 'success') {
          alert('success onUpdateUserInfo');
        } else {
          alert('Fail at onUpdateUserInfo, s. Console Output');
        }
      },
      () => {
        alert('error');
      },
      () => {
        this.activeModal.close();
        this.router.navigate(['editor']);
      }
    );
  }
}
