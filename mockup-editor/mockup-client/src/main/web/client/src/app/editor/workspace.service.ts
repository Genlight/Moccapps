import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  showsRuler: BehaviorSubject<boolean> = new BehaviorSubject(false);
  toolbarPanelState: BehaviorSubject<ToolbarPanelState> = new BehaviorSubject(ToolbarPanelState.None);

  constructor() { }

  showRuler(): void {
    this.showsRuler.next(true);
  } 
  
  hideRuler(): void {
    this.showsRuler.next(false);
  }

  
}

export enum ToolbarPanelState {
  None,
  Library,
  Pages
}
