import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElementsService {

  constructor(private apiService: ApiService) { }

  getElements<T>(): Observable<T> {
    return this.apiService.get<T>('/editor/elements');
  }
}
