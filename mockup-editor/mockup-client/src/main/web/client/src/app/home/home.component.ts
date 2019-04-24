import {Component, EventEmitter, Injectable, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from "../api.service";
import {NgForm} from "@angular/forms";
import {NgbTabset} from "@ng-bootstrap/ng-bootstrap";
import {NavbarComponent} from "../shared/components/navbar/navbar.component";
import {BehaviorSubject} from "rxjs";
import {UserModel} from "../shared/models/user.model";
import {DataService} from "../data.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  testUser: UserModel;

  @ViewChild('tabs')
  private tabs: NgbTabset;

  constructor(private router: Router,
              private api: ApiService,
              private data: DataService) {
  };

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.testUser = message)
  }

  onSubmit(logForm: NgForm) {
    console.log(logForm);
    if (document.activeElement.id == 'register') {
      console.log('register');
      let test = this.api.registerUser(logForm.form.value.email, logForm.form.value.password, logForm.form.value.username);
      test.then(res => {
        if (res == true) {
          console.log('register - true');
          this.tabs.select("loginTab");
        } else {
          console.log('register - false');
        }
      });

    } else if (document.activeElement.id == 'login') {
      console.log('login');

      let test = this.api.login(logForm.form.value.email, logForm.form.value.password, "username");
      test.then(res => {
        if (res != null) {
          res = res as UserModel;
          let user1 = new UserModel(res.username, res.email);
          console.log(user1.toString());
          console.log('login - true:' + user1.toString());
          this.data.changeMessage(user1)
          this.router.navigate(['editor']);
        } else {
          console.log('login - false');
        }
      });

    }
    console.log(logForm.form.value.email);
  }

}
