import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

import { HttpClient } from "@angular/common/http";
import {UserModel} from "./shared/models/user.model";
import {BehaviorSubject} from "rxjs";

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  async registerUser(email: string, password: string, username: string) {
    let postData = new FormData();
    postData.append('password' ,password);
    postData.append('email' ,email);
    postData.append('username' ,username);

    let result: boolean;
    result = await this.http
      .post<boolean>(API_URL + '/register', postData)
      .toPromise()
    console.log("Service:" + result);
    return result;
  }

  async login(email: string, password: string, username: string) {
    let postData = new FormData();
    postData.append('username' ,username);
    postData.append('password' ,password);
    postData.append('email' ,email);
    let result: UserModel;
    result = <UserModel>await this.http
      .post<UserModel>(API_URL + '/login', postData)
      .toPromise();
    console.log("Service:" + result.toString());
    return result;
  }

  async logout(email: string) {
    let postData = new FormData();
    postData.append('email' ,email);
    let result: boolean;
    result = <boolean>await this.http
      .post<boolean>(API_URL + '/logout', postData)
      .toPromise();
    console.log("Service:" + result);
    return result;
  }
}
