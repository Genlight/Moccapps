import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../../models/User';
import { Password } from '../../models/Password';
import { TokenStorageService } from '../../../auth/token-storage.service';
import { environment } from '../../../../environments/environment';
// const testUser = { id: 1, name: 'Name1', email: 'some.email@outlook.com' };
// const source: Observable<User> = of(testUser);

const API_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class UserinfoService {

  constructor(
    private http: HttpClient,
    private tokenService: TokenStorageService
  ) { }

  getUserInfo() {
    return of({name: this.tokenService.getUsername(), email:  this.tokenService.getEmail() });
  }
  updateUserInfo(user: User, pwd: Password): Observable<any> {
    if ( typeof pwd.pwd === 'undefined') {
        pwd.pwd = '';
    }
    return this.http.post(API_URL + '/user', {
        username: user.name,
        email: this.tokenService.getEmail(),
        password: user.password,
        newpwd: pwd.pwd })
      .pipe(
        tap(_ => {
          console.log('called POST on /user');
          this.tokenService.saveUsername(user.name);
       }),
    catchError(this.handleError<any>('updateUserInfo', []))
      );
  }
  /**
   * copied from: https://angular.io/tutorial/toh-pt6
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
