import PNotify from 'pnotify/dist/es/PNotify';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {
    PNotifyButtons; // Initiates the module. Important!
    PNotify.defaults.styling = 'bootstrap4';
    PNotify.defaults.delay = 4000;
  }
  getPNotify() {
    PNotifyButtons; // Initiate the module. Important!
    return PNotify;
  }
  showError(message: string, title?: string) {
    PNotify.error({
      title: title || 'Error',
      text: message,
      modules: {
        Buttons: {
          sticker: false,
          closer: false
        }
      }
    }).on('click', function() {
      this.close();
    });
  }

  showSuccess(message: string, title?: string) {
    PNotifyButtons;
    PNotify.success({
      title: title || 'Success',
      text: message,
      modules: {
        Buttons: {
          sticker: false,
          closer: false
        }
      }
    }).on('click', function() {
      this.close();
    });
  }

}
