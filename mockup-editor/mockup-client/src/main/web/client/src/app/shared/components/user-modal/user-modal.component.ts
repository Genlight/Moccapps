import { Component, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../models/User';
import { Password } from '../../models/Password';
import { UserinfoService } from '../../services/userinfo.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { AuthLogoutInfo } from '../../../auth/logout-info';
import { NotificationService } from '../../services/notification.service';
// import { EqualValidator } from '../../directives/equalValidator.directive';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
  // directives: [EqualValidator]
})
export class UserModalComponent implements OnInit {

  user: User;
  pwd: Password;
  formSubmitted;

  constructor(
    public activeModal: NgbActiveModal,
    private userInfoService: UserinfoService,
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.user = new User();
    this.pwd = new Password();
    this.userInfoService.getUserInfo()
      .subscribe((data: any) => this.user = {
        name:  data.name,
        email: data.email
    });
    this.formSubmitted = false;
  }
  onUpdateUserInfo(): void {
    const pnote = this.notificationService.getPNotify();
    this.userInfoService.updateUserInfo(this.user, this.pwd).subscribe(
      (data: any) => {
        if (data.message === 'success') {
          if (this.pwd.pwd !== '') {
                this.notificationService.showSuccess(
                  `Because you changed your Password, you will be logged out. Pleas Sign in again.`,
                  'Success on Update'
                );
                this.router.navigate(['']);
          } else {
            pnote.success('Update successful');
            this.router.navigate(['editor']);
          }
        } else {
          pnote.error(data.message);
          this.activeModal.close('error');
        }
      },
      () => {
        pnote.error('Unknown Error');
        this.activeModal.close('error');
      },
      () => {
        this.activeModal.close('success');
      }
    );
  }
}
