import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Observable, of } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-manage-user-modal',
  templateUrl: './manage-user-modal.component.html',
  styleUrls: ['./manage-user-modal.component.scss']
})
export class ManageUserModalComponent implements OnInit {

  faEllipsisV = faEllipsisV;

  @Input() project;

  model: any;
  results = ['Test1', 'Test2'];

  projectMembers: User[] = [
    {
      name: 'Mark',
      email: 'mark@example.com'
    },
    {
      name: 'Mark2',
      email: 'mark2@example.com'
    },
    {
      name: 'Mark3',
      email: 'mark@example.com'
    },
    {
      name: 'Mark4',
      email: 'mark@example.com'
    },
  ];

  testUsers: Observable<User[]> = of(
    [
      {
        name: 'Mark',
        email: 'mark@example.com'
      },
      {
        name: 'Mark',
        email: 'mark@example.com'
      }
    ]
  )



  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  onRemoveUserFromProject(user) {
    const index = this.projectMembers.indexOf(user);
    this.projectMembers.splice(index, 1);
  }

  onApply() {
    this.activeModal.close();
  }

  search(searchTerm) {
    //return of(['m1']);
    return this.userService.searchUser(searchTerm).pipe(
      map((response) => {
        const jsonUsers = ((response as any).message);
        let users = JSON.parse(jsonUsers) as User[];
        //console.log(users);
     
        let usernames = users.map(user => user.username);
        return usernames;
      })
    )
  }

  searchUser = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      //map(term => (term.length < 2) ? [] : this.results),
      switchMap(term => 
        this.search(term)
        //this.search(term)
      )
    /*   switchMap(term => 
        
      ); */
      
      // map(term => this.results.filter(result => result.toLowerCase().indexOf(term.toLowerCase())))
    );
  }
}
