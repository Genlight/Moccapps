import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-manage-user-modal',
  templateUrl: './manage-user-modal.component.html',
  styleUrls: ['./manage-user-modal.component.scss']
})
export class ManageUserModalComponent implements OnInit {

  faEllipsisV = faEllipsisV;

  model: any;

  projectMembers: User[] = [
    {
      name: 'Mark',
      email: 'mark@example.com'
    },
    {
      name: 'Mark',
      email: 'mark@example.com'
    }];

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  onRemoveUserFromProject(user) {
  }

  results = ['Test1', 'Test2'];

  searchUser = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      map(term => (term.length < 2) ? [] : this.results)
      //map(term => this.results.filter(result => result.toLowerCase().indexOf(term.toLowerCase())))
    );
  }
}
