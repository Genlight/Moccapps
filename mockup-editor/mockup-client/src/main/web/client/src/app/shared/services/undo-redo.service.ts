/**
 * Undo Redo service, found a similar js-Sample at
 * https://jsfiddle.net/tazehale/q2mz23xb/
 *
 *
 * @param  {providedIn Root}
 */

import { Injectable } from '@angular/core';
import { Action } from '../models/Transformation';
import { ManagePagesService } from '../../editor/managepages.service';
import { FabricmodifyService } from '../../editor/fabricmodify.service';
import { UndoRedoState, ReplayAction } from '../models/UndoRedoState';
import { fabric } from '../../editor/extendedfabric';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UndoRedoService {

  //  the fabricJS canvas Object
  canvas: fabric.Object;
  // current unsaved state
  state: UndoRedoState;
  // past states
  undoStack: UndoRedoState[];
  // reverted states
  redoStack: UndoRedoState[];
  undoObs: BehaviorSubject<boolean>;
  redoObs: BehaviorSubject<boolean>;

  constructor(
    private managepageService: ManagePagesService,
    private modifyService: FabricmodifyService
  ) {
    this.redoObs = new BehaviorSubject<boolean>(false);
    this.undoObs = new BehaviorSubject<boolean>(false);
    this.canvas = this.managepageService.getCanvas();
    this.undoStack = [];
    this.redoStack = [];
  }
  /**
   * initializes the undoRedoService with an initial State.
   * is necessary because all other states are managed through that.
   * @param  state [description]
   * @return        [description]
   */
  save(canvas: any, action: Action): void {
    // set to null
    this.redoStack = [];
    // if ( !Array.isArray(objects)){
    //   objects = [objects];
    // }
    // if (state.type === 'activeSelection') {
    //   this.canvas.getActiveObject().forEachObject(next);
    //   return;
    // }
    // if (Array.isArray(transObject)) {
    //   transObject.forEach(next);
    // } else {
    //   next(transObject);
    // }

    this.state = {objects: JSON.stringify(canvas), action };

    console.log('redo disabled.');
    this.redoObs.next(false);
    // initial call won't have a state
    if (this.state) {
      this.undoStack.push(this.state);
      console.log('undo enabled');
      this.undoObs.next(true);
    }
    // switch (action) {
    //   case Action.ADDED : {
    //     break;
    //   }
    //   case Action.MODIFIED: {
    //     this.undoStack.push({objects: this.state, action}: UndoRedoState);
    //     console.log('undo enabled');
    //     break;
    //   }
    //   case Action.REMOVED: {
    //     break;
    //   }
    //   default: {
    //     console.log('Undefined Action received. Action: ' + action);
    //     break;
    //   }
    // }
    // this.undoObs.next(true);
  }
  /**
   * Save the current state in the redo stack, reset to a state in the undo stack, and enable the buttons accordingly.
   * Or, do the opposite (redo vs. undo)
   * @param playStack which stack to get the last state from and to then render the canvas as
   * @param saveStack which stack to push current state into
   * @param player associated is**doing, after state change it will be checked if there are any states left n this stack
   * @param stacker associated is**doing, same as above
   */
  replay(playStack, saveStack, player: BehaviorSubject<boolean>, stacker: BehaviorSubject<boolean>) {
     this.canvas = this.managepageService.getCanvas();
     // (playStack, saveStack, buttonsOn, buttonsOff) {
     saveStack.push(this.state);
     this.state = playStack.pop();
     // turn both buttons off for the moment to prevent rapid clicking
     player.next(false);
     stacker.next(false);
     this.canvas.clear();
     this.canvas.loadFromJSON(this.state, () => {
       this.canvas.renderAll();
       stacker.next(true);
       // true, if any states left
       if (playStack.length) {
         player.next(false);
       }
     });
  }

  undo(canvas) {
    this.canvas = canvas;
    this.replay(this.undoStack, this.redoStack, this.undoObs, this.redoObs);
  }
  redo(canvas) {
    this.canvas = canvas;
    this.replay(this.redoStack, this.undoStack, this.redoObs, this.undoObs);
  }
  getRedoObs(): Observable<boolean> {
    return this.redoObs.asObservable();
  }
  getUndoObs(): Observable<boolean> {
    return this.undoObs.asObservable();
  }
}
