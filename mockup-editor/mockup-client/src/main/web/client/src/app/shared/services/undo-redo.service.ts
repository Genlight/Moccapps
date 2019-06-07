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
import { UndoRedoState, ReplayAction, CanvasState } from '../models/UndoRedoState';
import { fabric } from '../../editor/extendedfabric';
import { Observable, BehaviorSubject } from 'rxjs';
import { SocketConnectionService } from '../../socketConnection/socket-connection.service';

@Injectable({
  providedIn: 'root'
})

export class UndoRedoService {
  // past states
  undoStack: UndoRedoState[];
  // reverted states
  redoStack: UndoRedoState[];
  // Observables for buttons (enable/ disable)
  undoObs: BehaviorSubject<boolean>;
  redoObs: BehaviorSubject<boolean>;
  state: CanvasState;
  isReplaying = false;

  constructor(
    private managepageService: ManagePagesService,
    private modifyService: FabricmodifyService,
    private socketService: SocketConnectionService
  ) {
    this.redoObs = new BehaviorSubject<boolean>(false);
    this.undoObs = new BehaviorSubject<boolean>(false);
    this.undoStack = [];
    this.redoStack = [];

    this.redoObs.next(false);
    this.undoObs.next(false);
  }
  saveInitialState() {
    // TODO: this needs to be accordingly modified when persisted elements are loaded
    this.state = {
      canvas: this.managepageService.getCanvas().clone((o) => {
          console.log('saved State: ' + JSON.stringify(o)); 

          return o;
        }
      ),
      action: Action.PAGECREATED
    };
  }
  /**
   * initializes the undoRedoService with an initial State.
   * is necessary because all other states are managed through that.
   * @param  state [description]
   * @return        [description]
   */
  save(objects: any, action: Action): void {
    // during replay, there should'nt be any saves 
    if (this.isReplaying) {
      return;
    }
    const canvas = this.managepageService.getCanvas();


   
    // previous state
    let _this = this;
    const prevList = [];
    if(action!==Action.ADDED) {
      //add doesn't have a previous state
      if(this.state){
      this.forEachObject(objects, (obj) => {
        const prev = this.getObjectByUUID(obj.uuid, (_this.state.canvas));

        prev.clone( (o) => { prevList.push(o); } );
      })};
    }
    const currentList = [];
    if(action!==Action.REMOVED) {
      //removed doesn't have a current
    this.forEachObject(objects, (obj) => {
       obj.clone( (o) => {
         o.uuid = obj.uuid;
         currentList.push(o);
        } );
    })};
    // push to undoStack
    this.undoStack.push({
      previous: prevList,
      current: currentList,
      action
    });
    
    this.setState(canvas, action);

    // set redoStack to null
    this.redoStack = [];
    this.redoObs.next(false);


    //console.log('show me the stack: '+JSON.stringify(this.undoStack));
    // initial call won't have a state
    if ( this.state.action === Action.PAGECREATED )  {
      console.log('undo disabled because Page was just created');
      this.undoObs.next(false);
    } else {
      this.undoObs.next(true);
    }
  }
  /**
   * Save the current state in the redo stack, reset to a state in the undo stack, and enable the buttons accordingly.
   * Or, do the opposite (redo vs. undo)
   * @param playStack which stack to get the last state from and to then render the canvas as
   * @param saveStack which stack to push current state into
   * @param player  associated is**doing, after state change it will be checked if there are any states left n this stack
   * @param stacker associated is**doing, same as above
   */
  replay(playStack: UndoRedoState[], saveStack: UndoRedoState[], player: BehaviorSubject<boolean>, stacker: BehaviorSubject<boolean>) {
    this.isReplaying = true;
    const canvas = this.managepageService.getCanvas();
    const replayState = playStack.pop();
    // turn both buttons off for the moment to prevent rapid clicking
    player.next(false);
    stacker.next(false);

    saveStack.push({
      previous: replayState.current,
      current: replayState.previous,
      action: this.invertAction(replayState.action)
    });
    // removing old objects
    console.log(`Removing replayState.current: ${JSON.stringify(replayState.current)}`);
    /*fabric.util.enlivenObjects([JSON.parse(replayState.current)], (obj) => {
      const old = this.getObjectByUUID(obj.uuid, canvas);
      canvas.remove(old);
    });*/
    
    let _this = this;
    if(replayState.action === Action.ADDED ) {
      console.log('remove previously added elements: ' +JSON.stringify(replayState.current) );
      replayState.current.forEach((obj) => {
        let old = _this.getObjectByUUID(obj.uuid,canvas);
        canvas.remove(old);
      })
    }
    else if(replayState.action === Action.MODIFIED) {
      replayState.previous.forEach((obj) => {
        let current = _this.getObjectByUUID(obj.uuid,canvas);
        let keys = Object.keys(obj);
        keys.forEach(function(key) {
          current[key] = obj[key];
        });
        //this is necessary to reliably render all changes of the object
        current.setCoords()
        
      // TODO: this should be changed, for a cleaner seperation of concerns
      //move socket connection (maybe) to manage pages, reduce single dependencies and 
      // "all over the place" sends.
        _this.sendMessageToSocket(JSON.stringify(current), Action.MODIFIED);
      });
    }
    else if(replayState.action === Action.REMOVED) {
      console.log('add previously removed elements');
      replayState.previous.forEach((obj) => {
        //let old = _this.getObjectByUUID(obj.uuid,canvas);
        canvas.add(obj);
      })

    }
    this.setState(canvas,this.invertAction(replayState.action));
    canvas.renderAll();
    // add previous objects / State
    /*fabric.util.enlivenObjects([JSON.parse(replayState.previous)], ((obj) => {
        console.log(`Applying replayState.previous, object: ${JSON.stringify(obj)}`);
        canvas.add(obj);
        canvas.addWithUpdate();
        canvas.requestRenderAll();
      })
    );*/
    // set new state, needed fo save()
    //this.state.canvas = fabric.util.object.clone(canvas);
    this.isReplaying  = false;
    stacker.next(true);

    // Check, if there are holes in a stack
    console.log('Savestack-Length: ' + saveStack.length);
    if (playStack.length <= 0 || this.state.action === Action.PAGECREATED) {
      console.log('Playstack empty. Length: ' + playStack.length);
      player.next(false);
    } else {
      console.log('Playstack-Length: ' + playStack.length);
      player.next(true);
    }
  }
  /**
   * undoes a previous actions
   */
  undo() {
    console.log('undo: ');
    this.replay(this.undoStack, this.redoStack, this.undoObs, this.redoObs);
  }
  /**
   * redo a previous undone action
   */
  redo() {
    console.log('redo: ');
    this.replay(this.redoStack, this.undoStack, this.redoObs, this.undoObs);
  }
  getRedoObs(): Observable<boolean> {
    return this.redoObs.asObservable();
  }
  getUndoObs(): Observable<boolean> {
    return this.undoObs.asObservable();
  }
  /**
   * returns the inverted function for a Action
   * @param  action : Action
   * @return Action
   */
  invertAction(action: Action) {
    switch ( action) {
      case Action.ADDED: {
        return Action.REMOVED;
      }
      case Action.REMOVED: {
        return Action.ADDED;
      }
      case Action.PAGECREATED: {
        return Action.PAGECREATED;
      }
      default: {
        return Action.MODIFIED;
      }
    }
  }
  getObjectByUUID(uuid: string, canvas: fabric.Object) {
    return canvas.getObjects().find((o) => o.uuid === uuid);
  }

  /**
   * This was moved out of the actual undo/redo functionality: whether or not a change is 
   * undoable by me, the state needs always to be accurate.
   * @param canvas The actual canvas
   * @param action the action that took place
   */
  setState(canvas:any,action:Action) {
    canvas.clone((o) => {
      console.log('saved State: ' + JSON.stringify(o));
      this.state = { canvas: o, action };
    });
  }
/**
 * Replace this with a cleaner call to a service that bundles all the send calls
 * @param content object to be sent
 * @param command action that was taken
 */
  sendMessageToSocket(content: string, command: string){
    this.socketService.send(content,command);
  }

  /**
   * handling the three cases, in which an object can be (null, single, Array)
   * @param  object null | object | Array
   * @param  next   function to apply on each object
   * @return        [description]
   */
  forEachObject(object: any, next) {
    if (typeof object === 'undefined') {
      return;
    }
    if (Array.isArray(object)) {
      object.forEach(next);
    } else {
      next(object);
    }
  }
}
