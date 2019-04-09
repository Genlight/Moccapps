import { Component, OnInit } from '@angular/core';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  users = [
    { name: 'Alexander Genser' },
    { name: 'Bernhard Matyas' },
    { name: 'Martin Maisriemler'},
    { name: 'Yikai Yang' },
    { name: 'Matthias Deimel'},
    { name: 'Brigitte Blank-Landeshammer'}
  ];

  /**
   * users.map(x => `${user.split(' ')[0][0]}${user.split(' ')[1][0]}`);
   */

  usersInitials = this.users.map(user => `${user.name.split(' ')[0][0]}${user.name.split(' ')[1][0]}`);

  projectname = 'My project 1';

  constructor() { }

  ngOnInit() {
  }

}
