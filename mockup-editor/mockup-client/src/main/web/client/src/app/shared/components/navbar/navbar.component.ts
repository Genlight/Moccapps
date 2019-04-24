import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { faBars, faUndo, faRedo} from '@fortawesome/free-solid-svg-icons';
import { faCommentAlt } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import {UserModel} from "../../models/user.model";
import {Subscription} from "rxjs";
import {DataService} from "../../../data.service";
import {ApiService} from "../../../api.service";

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

  user1 = new UserModel("testUserNav", "test@test.com");
  currUser: UserModel = this.user1;

  testUser: UserModel;


  /**
   * users.map(x => `${user.split(' ')[0][0]}${user.split(' ')[1][0]}`);
   */

  // usersInitials = this.users.map(user => `${user.name.split(' ')[0][0]}${user.name.split(' ')[1][0]}`);
  projectname = 'My project 1';

  ngOnInit() {
    this.data.currentMessage.subscribe(item => {
      this.currUser = item, console.log("updated:" + this.currUser.toString())
    })
  }

  constructor(private router: Router,
              private data: DataService,
              private api: ApiService) {
  }

  onLogout() {
    this.api.logout(this.currUser.email);
    this.router.navigate(['']);
  }
}
