import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElementsService {

  userElements: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private apiService: ApiService) { }

  importImage(file: File) {
    this.userElements.next([{ 
      name: 'Browser Window',
      data: 'assets/img/system/Systems/browser_window.jpg',
      effectAllowed: 'all',
      previewimage: 'assets/img/system/Systems/browser_window.jpg'
    }, { 
        name: 'Collups Logo',
        data: 'assets/img/Logos/collups.svg',
        effectAllowed: 'all',
        previewimage: 'assets/img/Logos/collups.svg'
      }]);

      const reader = new FileReader();
    const imgdata = reader.readAsDataURL(file);
    var baseString;
    reader.onloadend = function () {
        baseString = reader.result;
    };
    console.log(baseString); 
  }

  getUserElements():Observable<string[]> {
    console.log("user elements: "+this.userElements);
    return this.userElements;
  }

  getElements<T>(): Observable<T> {
    return this.apiService.get<T>('/elements');
  }

  sendImage(img: File): Observable<any> {
    const reader = new FileReader();
    const imgdata = reader.readAsDataURL(img);
    var baseString;
    reader.onloadend = function () {
        baseString = reader.result;
    };
    console.log(baseString); 
    return this.apiService.post('/elements', img);
  }
}
