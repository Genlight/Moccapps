import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../../models/User';

const testUser = { id: 1, name: 'Name1', email: 'some.email@outlook.com' };
const source: Observable<User> = of(testUser);

// const API_URL = environment.apiUrl;
const API_URL = 'locahost:4200';
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
  updateUserInfo(user: User): Observable<any> {
    const postData = new FormData();
    postData.append('password', user.pwd);
    postData.append('username', user.name);

    return of({message: 'success'});
    // return this.http.post(API_URL + '/user', postData)
    //   .pipe(
    //     tap(_ => { console.log('called POST on /user'); }),
    // catchError(this.handleError<any>('updateUserInfo', []))
    //   );
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
