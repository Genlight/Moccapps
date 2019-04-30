import {Component, OnInit} from '@angular/core';
import {faBars, faRedo, faUndo} from '@fortawesome/free-solid-svg-icons';
import {faCommentAlt} from '@fortawesome/free-regular-svg-icons';
import {Router} from '@angular/router';
import {DataService} from "../../../data.service";
import {TokenStorageService} from "../../../auth/token-storage.service";
import {AuthService} from "../../../auth/auth.service";
import {AuthLogoutInfo} from "../../../auth/logout-info";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  faBars = faBars;
  faUndo = faUndo;
  faRedo = faRedo;
  faCommentAlt = faCommentAlt;

  users = [
    { name: 'Alexander Genser', initials: 'AG' },
    { name: 'Bernhard Matyas' , initials: 'BM' },
    { name: 'Martin Maisriemler', initials: 'MM'},
    { name: 'Yikai Yang', initials: 'YY'},
    { name: 'Matthias Deimel', initials: 'MD'},
    { name: 'Brigitte Blank-Landeshammer', initials: 'BB'}
  ];
  info: any;




  /**
   * users.map(x => `${user.split(' ')[0][0]}${user.split(' ')[1][0]}`);
   */

  // usersInitials = this.users.map(user => `${user.name.split(' ')[0][0]}${user.name.split(' ')[1][0]}`);
  projectname = 'My project 1';

  constructor(private router: Router,
              private data: DataService,
              private tokenStorage: TokenStorageService,
              private authService: AuthService,) {
  }

  ngOnInit() {
    this.data.currentMessage.subscribe(item => {
      this.info = {
        token: this.tokenStorage.getToken(),
        username: this.tokenStorage.getUsername(),
      };
    })
  }

  onLogout() {
    // this.api.logout(this.currUser.email);
    this.authService.logout(new AuthLogoutInfo(this.tokenStorage.getEmail()));
    this.tokenStorage.signOut();
    this.router.navigate(['']);
  }
}
