import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from "@angular/forms";
import {NgbTabset} from "@ng-bootstrap/ng-bootstrap";
import {DataService} from "../data.service";
import {AuthService} from "../auth/auth.service";
import {TokenStorageService} from "../auth/token-storage.service";
import {AuthLoginInfo} from "../auth/login-info";
import {SignUpInfo} from "../auth/signup-info";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  loginInfo: AuthLoginInfo;

  signupInfo: SignUpInfo;
  isSignedUp = false;
  isSignUpFailed = false;

  @ViewChild('tabs')
  private tabs: NgbTabset;

  constructor(private router: Router,
              private data: DataService,
              private authService: AuthService,
              private tokenStorage: TokenStorageService) {
  };

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    }
  }

  onSubmit(logForm: NgForm) {
    console.log(logForm);
    if (document.activeElement.id == 'register') {
      console.log('register');


      this.signupInfo = new SignUpInfo(
        logForm.form.value.username,
        logForm.form.value.email,
        logForm.form.value.password);

      this.authService.signUp(this.signupInfo).subscribe(
        data => {
          console.log(data);
          this.isSignedUp = true;
          this.isSignUpFailed = false;
          this.tabs.select("loginTab");
        },
        error => {
          console.log(error);
          this.errorMessage = error.error;
          this.isSignUpFailed = true;
        }
      );

    } else if (document.activeElement.id == 'login') {

      this.loginInfo = new AuthLoginInfo(
        logForm.form.value.email,
        logForm.form.value.password);

      this.authService.attemptAuth(this.loginInfo).subscribe(
        data => {
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveUsername(data.username);
          this.tokenStorage.saveEmail(logForm.form.value.email);

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.router.navigate(['editor']);
        },
        error => {
          console.log(error);
          this.errorMessage = error.error.reason;
          this.isLoginFailed = true;
        }
      );

      console.log('login');

    }
    console.log(logForm.form.value.email);
  }

}
