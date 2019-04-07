import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  users = 
  [
    { name: 'Alexander Genser' },
    { name: 'Bernhard Matyas' },
    { name: 'Martin Maisriemler'},
    { name: 'Yikai Yang' },
    { name: 'Matthias Deimel'},
    { name: 'Brigitte Blank-Landeshammer'}
  ];

  projectname = 'My project 1';

  constructor() { }

  ngOnInit() {
  }

}
