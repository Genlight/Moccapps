import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {UserModel} from "./shared/models/user.model";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private messageSource = new BehaviorSubject(new UserModel("dataTest", "data@test.com"));
  currentMessage = this.messageSource.asObservable();

  constructor() {
  }

  changeMessage(message: UserModel) {
    console.log("updated:" + message.toString());
    this.messageSource.next(message);
  }

}
