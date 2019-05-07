import PNotify from 'pnotify/dist/es/PNotify';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { 
    PNotifyButtons;
    PNotify.defaults.styling = 'bootstrap4'; 
  }

  showError(message: string, title?: string) {
    PNotify.error({
      title: title || 'Error',
      text: message
    });
  }

  showSuccess(message: string, title?: string) {
    PNotify.success({
      title: title || 'Success',
      text: message
    });
  }
}
