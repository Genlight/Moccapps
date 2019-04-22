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

  projects = [
    {
      name: 'Project 1',
      collaborators: [
        { username: 'User 1'},
        { username: 'user 2'}
      ],
      last_edited: new Date()
    },
  ];

  invitedProject = [
    {
      name: 'Super project',
      invited_by: {
        username: 'User 5'
      }
    },
    {
      name: 'Super project 2',
      invited_by: {
        username: 'User 5'
      }
    },
    {
      name: 'Super project 3',
      invited_by: {
        username: 'User 5'
      }
    }
  ];

  constructor(private router: Router) { 

  }

  ngOnInit() {
  }

  onCreateNewProject() {
    this.router.navigate(['editor']);
  }

}
