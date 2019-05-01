import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {JwtResponse} from './jwt-response';
import {AuthLoginInfo} from './login-info';
import {SignUpInfo} from './signup-info';
import {environment} from "../../environments/environment";
import {AuthLogoutInfo} from "./logout-info";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient) {
  }

  attemptAuth(credentials: AuthLoginInfo): Observable<JwtResponse> {
    console.log(credentials.toString())
    return this.http.post<JwtResponse>(API_URL + '/login', credentials, httpOptions);
  }

  signUp(info: SignUpInfo): Observable<string> {
    console.log(info.toString())
    return this.http.post<string>(API_URL + '/register', info, httpOptions);
  }

  logout(info: AuthLogoutInfo): Observable<string> {
    return this.http.post<string>(API_URL + '/logout', info, httpOptions);
  }
}
