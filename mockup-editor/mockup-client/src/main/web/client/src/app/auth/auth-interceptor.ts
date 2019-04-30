import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {TokenStorageService} from './token-storage.service';
import {Observable} from "rxjs";

//const TOKEN_HEADER_KEY = 'x-access-token';
const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private token: TokenStorageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.token.getToken();
    if (token != null) {
      authReq = req.clone({headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token)});
    }
    return next.handle(authReq);
    /*    return next.handle(authReq).pipe(
          tap(
            event => {
              //logging the http response to browser's console in case of a success
              if (event instanceof HttpResponse) {
                console.log("api call success :", event);
                if(event.headers.has('Authorization')){
                  console.log("Set new token:",event.headers.get('Authorization'));
                  this.token.saveToken(event.headers.get('Authorization'));
                }
              }
            },
            error => {
              //logging the http response to browser's console in case of a failuer
              if (event instanceof HttpResponse) {
                console.log("api call error :", event);
              }
            }
          )
        );*/
  }
}

export const httpInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];
