import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  user = {
    username: 'Max Mustermann'
  };

  constructor(private router: Router) { 

  }

  ngOnInit() {
  }

}
