import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  showsRuler: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  showRuler(): void {
    this.showsRuler.next(true);
  } 
  
  hideRuler(): void {
    this.showsRuler.next(false);
  }
}
