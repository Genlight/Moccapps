import {Injectable} from '@angular/core';
import { User } from '../shared/models/User';

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUsername';
const EMAIL_KEY = 'AuthEmail';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() {
  }

  signOut() {
    window.sessionStorage.clear();
  }

  public saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUsername(username: string) {
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY, username);
  }

  public getUsername(): string {
    return sessionStorage.getItem(USERNAME_KEY);
  }

  public saveEmail(email: string) {
    window.sessionStorage.removeItem(EMAIL_KEY);
    window.sessionStorage.setItem(EMAIL_KEY, email);
  }

  public getEmail(): string {
    return sessionStorage.getItem(EMAIL_KEY);
  }

  public isLoggedIn(): boolean {
    if (this.getToken() == null) {
      return false;
    }
    return true;
  }

  /**
   * author alexander Genser
   * returns currentUser object
   * @return User
   */
  getUserInfo(): User {
    return {
      username: this.getUsername(),
      name: this.getUsername(),
      email: this.getEmail()
    };
  }
}
