import { Injectable } from '@angular/core';
import PNotify from 'pnotify/dist/es/PNotify';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { 
    PNotifyButtons;
    PNotify.defaults.styling = 'bootstrap4'; 
  }

  public handleError(error: HttpErrorResponse) {
    console.error(error);
    PNotify.error({
      title: error.statusText,
      text: 'Error while communcating with server.'
    });
  }
}
