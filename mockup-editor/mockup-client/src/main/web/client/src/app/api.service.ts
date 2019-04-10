import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

import { HttpClient } from "@angular/common/http";

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public registerUser(email:string,password:string,username:string) {
    let postData = new FormData();
    postData.append('password' ,password);
    postData.append('email' ,email);
    postData.append('username' ,username);
    return this.http
      .post(API_URL + '/register', postData)
      .subscribe(data => {
          console.log(data);
        },
        err => {
          console.log('Error: ' + err.error);
        });
  }

  public login(email:string,password:string,username:string) {
    let postData = new FormData();
    postData.append('username' ,username);
    postData.append('password' ,password);
    postData.append('email' ,email);

    return this.http
      .post(API_URL + '/login', postData)
      .subscribe(data => {
          console.log(data);
        },
        err => {
          console.log('Error: ' + err.error);
        });
  }

  public logout(email:string) {
    let postData = new FormData();
    postData.append('email' ,email);

    return this.http
      .post(API_URL + '/logout', postData)
      .subscribe(data => {
          console.log(data);
        },
        err => {
          console.log('Error: ' + err.error);
        });
  }
}
