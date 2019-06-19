import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  showsRuler: BehaviorSubject<boolean> = new BehaviorSubject(false);
  showsGrid: BehaviorSubject<boolean> = new BehaviorSubject(false);
  toolbarPanelState: BehaviorSubject<ToolbarPanelState> = new BehaviorSubject(ToolbarPanelState.None);

  store: {
    toolbarPanelState: ToolbarPanelState
  };

  constructor() {
    this.store = {
      toolbarPanelState: ToolbarPanelState.None
    }
  }

  showRuler(): void {
    this.showsRuler.next(true);
  }

  hideRuler(): void {
    this.showsRuler.next(false);
  }

  showGrid(): void {
    this.showsGrid.next(true);
  }

  hideGrid(): void {
    this.showsGrid.next(false);
  }

  togglePages(): void {
    if (this.store.toolbarPanelState === ToolbarPanelState.Pages) {
      this.store.toolbarPanelState = ToolbarPanelState.None;
    } else {
      this.store.toolbarPanelState = ToolbarPanelState.Pages;
    }

    this.toolbarPanelState.next(this.store.toolbarPanelState);
  }

  toggleLibrary(): void {
    if (this.store.toolbarPanelState === ToolbarPanelState.Library) {
      this.store.toolbarPanelState = ToolbarPanelState.None;
    } else {
      this.store.toolbarPanelState = ToolbarPanelState.Library;
    }

    this.toolbarPanelState.next(this.store.toolbarPanelState);
  }

  toggleGroups(): void {
    if (this.store.toolbarPanelState === ToolbarPanelState.Groups) {
      this.store.toolbarPanelState = ToolbarPanelState.None;
    } else {
      this.store.toolbarPanelState = ToolbarPanelState.Groups;
    }

    this.toolbarPanelState.next(this.store.toolbarPanelState);
  }
}

export enum ToolbarPanelState {
  None,
  Library,
  Pages,
  Groups
}
