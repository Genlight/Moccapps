import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AuthLoginInfo} from "./auth/login-info";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private messageSource = new BehaviorSubject(new AuthLoginInfo("dataTest", "data@test.com"));
  currentMessage = this.messageSource.asObservable();

  constructor() {
  }

  changeMessage(message: AuthLoginInfo) {
    console.log("updated:" + message.toString());
    this.messageSource.next(message);
  }

}
