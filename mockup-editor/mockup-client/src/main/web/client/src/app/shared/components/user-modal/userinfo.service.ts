import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../../models/User';

const testUser: User = { id: 1, name: 'Name1', email: 'some.email@outlook.com' };
const source = of(testUser);
@Injectable({
  providedIn: 'root'
})
export class UserinfoService {

  constructor(
    private http: HttpClient
  ) { }

  getUserInfo() {
    // return this.http.get('/user');
    return source;
  }
  updateUserInfo(user: User) {
    alert('userinfo.service: updateuserinfo:');
    // const postData = new FormData();
    // postData.append('password', user.password);
    // postData.append('email' , user.email);
    // postData.append('username', user.name);
    // postData.append('id', user.id.toString());
    // this.http.post('/user', postData);
  }
  updatePassword(user: User, password: string) {
    const postData = new FormData();
    // postData.append('password', user.password);
    postData.append('email' , user.email);
    postData.append('username', user.name);
    postData.append('id', user.id.toString());

    return this.http.post('/user/pwd', postData);
  }
}
