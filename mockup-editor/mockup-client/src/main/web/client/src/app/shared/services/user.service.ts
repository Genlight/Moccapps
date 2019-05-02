import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { HttpParams } from '@angular/common/http';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) { }

  searchUser(searchTerm: string) {
    const params = new HttpParams().set('search', searchTerm);
    this.apiService.get('/user', params);
  }

  updateUser(user: User) {
    this.apiService.post(`/user/${user.id}`, user);
  }
  getUserInfo(user: User) {
    return this.apiService.get('/user');
  }
  updateUserInfo(user: User) {
    const postData = new FormData();
    // postData.append('password', user.password);
    postData.append('email' , user.email);
    postData.append('username', user.name);
    postData.append('id', user.id);
    this.apiService.post('/user', postData );
  }
  // updatePassword(user: User, password: string) {
  //   const postData = new FormData();
  //   // postData.append('password', user.password);
  //   postData.append('email' , user.email);
  //   postData.append('username', user.name);
  //   postData.append('id', user.id);
  //
  //   this.apiService.post('/user/pwd', );
  // }
}
