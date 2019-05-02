import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserinfoService {

  constructor(
    private http: HttpClient
  ) { }

  getUserInfo() {
    return this.http.get('/user');
  }
  updateUserInfo(user: User) {
    const postData = new FormData();
    // postData.append('password', user.password);
    postData.append('email' , user.email);
    postData.append('username', user.name);
    postData.append('id', user.id);
    this.http.post('/user', postData);
  }
  updatePassword(user: User, password: string) {
    const postData = new FormData();
    // postData.append('password', user.password);
    postData.append('email' , user.email);
    postData.append('username', user.name);
    postData.append('id', user.id);

    return this.http.post('/user/pwd', postData);
  }
}
