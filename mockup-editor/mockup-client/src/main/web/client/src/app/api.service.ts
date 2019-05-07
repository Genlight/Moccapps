import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }



  public get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${API_URL}${path}`, {params});
  }

  public put(path: string, body: object = {}): Observable<any> {
    return this.http.put(`${API_URL}${path}`, body);
  }

  public post(path: string, body: object = {}): Observable<any> {
    return this.http.post(`${API_URL}${path}`, body);
  }

  public delete(path): Observable<any> {
    return this.http.delete(
      `${API_URL}${path}`
    );
  }
/*
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
  }*/

/*  public login(email:string,password:string,username:string) {
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
  }*/

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
