import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
 
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { ErrorHandlerService } from '../services/error-handler.service';
import { AuthService } from 'src/app/auth/auth.service';
import { TokenStorageService } from 'src/app/auth/token-storage.service';
import { AuthLogoutInfo } from 'src/app/auth/logout-info';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
 
@Injectable()
export class RequestInterceptor implements HttpInterceptor {
 
  constructor(
    private errorHandlerService: ErrorHandlerService,
    private authService: AuthService,
    private router: Router,
    private tokenStorage: TokenStorageService,
    private notificationService: NotificationService
  ) {}
 
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).do((event: HttpEvent<any>) => {}, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        console.error(err);
        if (err.status === 401) {
            //Unauthorized
            this.tokenStorage.signOut();
            this.router.navigate(['']);
            this.notificationService.showError('The username or password you entered is incorrect.', 'Authentication error.');
          }
        else if (err.status === 408) {
          //Unauthorized
          this.tokenStorage.signOut();
          this.router.navigate(['']);
          this.notificationService.showError('You were automatically logged out due to security reasons. This may be due to a login from another location or inactivity.', 'Authentication error.');
        }else {
          this.errorHandlerService.handleError(err);
        }
      }
    });
  }
}
