import { Component, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../models/User';
import { UserinfoService } from './userinfo.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { AuthLogoutInfo } from '../../../auth/logout-info';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {

  user: User;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private userInfoService: UserinfoService,
    private router: Router,
    private authService: AuthService
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
          if (this.user.pwd !== '') {
              this.authService.logout(new AuthLogoutInfo(this.user.email)).subscribe(
                () => {
                  alert('Success on Update. Because you changed your Password, you will be logged out. Pleas Sign in again.');
                }
              );
          } else {
            alert('success onUpdateUserInfo');
            this.router.navigate(['editor']);
          }
        } else {
          alert('Fail at onUpdateUserInfo, s. Console Output');
          this.activeModal.close('error');
        }
      },
      () => {
        alert('error');
        this.activeModal.close('error');
      },
      () => {
        this.activeModal.close('success');
      }
    );
  }
}
