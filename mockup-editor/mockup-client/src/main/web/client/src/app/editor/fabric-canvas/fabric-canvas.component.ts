import { Component, OnInit, OnDestroy } from '@angular/core';
import { FabricmodifyService } from '../fabricmodify.service';
import { ManagePagesService } from '../managepages.service';
import { DndDropEvent } from 'ngx-drag-drop';
import { Subject } from 'rxjs';
import { Itransformation, Action } from './transformation.interface';
import { fabric } from '../extendedfabric';
import { SocketConnectionService } from '../../socketConnection/socket-connection.service';
import { TokenStorageService } from '../../auth/token-storage.service';

import { UndoRedoService } from '../../shared/services/undo-redo.service';

@Component({
  selector: 'app-fabric-canvas',
  templateUrl: './fabric-canvas.component.html',
  styleUrls: ['./fabric-canvas.component.scss']
})

export class FabricCanvasComponent implements OnInit, OnDestroy {

  // Fabric canvas. Note: this is not html canvas.
  // http://fabricjs.com/
  private canvas: any;

  // AsyncSubject is used, because we don't want to get notified, if we update
  // the canvas with Transformation from other users. AsyncSubject works so, that
  // only new events will be 'observed'.
  // NOTE: not used in the current version
  public Transformation: Subject<Itransformation>;

  constructor(
    private modifyService: FabricmodifyService,
    private managePagesService: ManagePagesService,
    private socketService: SocketConnectionService,
    private tokenStorage: TokenStorageService,
    private undoRedoService: UndoRedoService) { }

  // TODO: manage canvas for different pages and not just one
  ngOnInit() {
    this.managePagesService.createPage(900, 600);
    this.canvas = this.managePagesService.getCanvas();

    // saving initial state of canvas
    this.undoRedoService.save(this.canvas, Action.PAGECREATED);
    this.enableEvents();
    this.connectToSocket();
    this.Transformation = new Subject<Itransformation>();
  }

  
  enableEvents() {
    this.canvas
      .on('before:transform', (event) => { 
        this.sendMessageToSocket(JSON.stringify(event.transform.target.uuid),"lock");
        
      },)
      .on('object:added', (evt) => { this.onTransformation(evt, Action.ADDED); })
      .on('object:modified', (evt) => { this.onTransformation(evt, Action.MODIFIED); })
      .on('object:removed', (evt) => { this.onTransformation(evt, Action.REMOVED); })
      .on('object:added', (evt) => { this.onSaveState(evt, Action.ADDED); })
      .on('object:modified', (evt) => { this.onSaveState(evt, Action.MODIFIED); })
      .on('object:removed', (evt) => { this.onSaveState(evt, Action.REMOVED); });
  }

  /**
   * manages keyboard events:
   * - deleting selected elements on delete press
   * - copy/paste elements on ctrl+c/ctrl+v press
   * - cut elements on ctrl+x press
   * - undo/redo on ctrl+z/ctrl+y press
   * - group elements on ctrl+g press
   * - ungroup elements on ctrl+shift+g press
   * @param event keyboard event triggered when pressing a keyboard button
   */
  manageKeyboardEvents(event) {
    const canvas = this.managePagesService.getCanvas();
    if (event.ctrlKey) {
      if (event.keyCode === 67) { // 'c' key
        this.modifyService.copyElement(canvas);
      } else if (event.keyCode === 86) { // 'v' key
        this.modifyService.pasteElement(canvas);
      } else if (event.keyCode === 88) { // 'x' key
        this.modifyService.cutElement(canvas);
      } else if (event.keyCode === 90) { // 'z' key
        // TODO undo
      } else if (event.keyCode === 89) { // 'y' key
        // TODO redo
      } else if (event.keyCode === 71 && event.shiftKey) { // 'g' key
        this.modifyService.ungroup(canvas);
      } else if (event.keyCode === 71) { // 'g' key
        this.modifyService.group(canvas);
      }
    } else {
      if (event.keyCode === 46) { // delete key
        this.modifyService.removeElement(canvas);
      }
    }
  }

  /**
   * saves the elements in the workspace as JSON string in the local storage
   */
  onSaveToLocalStorage() {
    const json = JSON.stringify(this.canvas);
    console.log(json);
    localStorage.setItem('Canvas', json);
  }

  /**
   * loads previously saved elements from the local storage and updates the workspace
   * this overwrites all elements currently in the workspace, so elements that were not
   * saved before are lost
   */
  onLoadFromLocalStorage() {
    const storedCanvas = localStorage.getItem('Canvas');
    this.canvas.loadFromJSON(storedCanvas, () => {
      this.canvas.renderAll();
    });
  }

  /**
   * only used for tests in this component
   */
  onAddText() {
    this.modifyService.addText(this.canvas, 'text');
  }

  onUngroup() {
    this.modifyService.ungroup(this.canvas);
  }

  /**
   * receives a link to an image in the event data, creates a new fabric image
   * from the given source and adds this image to the workspace
   * if the image is in svg format, the contents of the svg are im ported
   * as paths and fills and then grouped together
   * //TODO all svg images are currently scaled to 200pc, all other images to 700px
   * @param event the event fired when a draggable item is dropped on the canvas
   */
  onDrop(event: DndDropEvent) {
    event.event.preventDefault();
    event.event.stopPropagation();
    const canvas = this.managePagesService.getCanvas();
    const url = event.data;
    if (url.includes('.svg') === true) {
      fabric.loadSVGFromURL(url, function(objects, options) {
        const loadedObjects = fabric.util.groupSVGElements(objects, options);
        loadedObjects.scaleToWidth(300);
        canvas.add(loadedObjects);
      });
    } else {
      fabric.Image.fromURL(url, (image) => {
        image.set({
          left: 10,
          top: 10,
          angle: 0,
          padding: 10,
          cornersize: 10,
          hasRotatingPoint: true,
        });
        image.scaleToWidth(700);
        this.canvas.add(image);
      });
    }
    canvas.renderAll();
    console.log('dropped', JSON.stringify(event, null, 2));
  }

  /**
   *
   * @param evt - Event-object, contains, the modified objects
   * @param action - one of the defined Actions,
   * which will be transmitted s. transformation.interface
   */
  onTransformation(evt, action: Action) {
    let transObject = evt.target;
    console.log(`${action} : ${transObject.uuid} , sendMe: ${transObject.sendMe}`);
    if (transObject.sendMe) {
      //this includes the "do not propagate this change" already on the send level, so minimal checks are necessary on the recieving side
      transObject.sendMe = false; 
      this.sendMessageToSocket(JSON.stringify(transObject),action);
      
    }
      //the object needs to be available again regardless of whether or not it was a remote access.
      //If the locking strategy involves sending it to the sender as well, this might need to be put into an else block (untested proposition)
      transObject.sendMe = true;
  }


  getObjectByUUID(uuid: string) {
    return this.canvas.getObjects().find((o) => o.uuid === uuid);
  }
  ngOnDestroy() {
    this.canvas.dispose();
  }
  /**
   * Undo Redo - functionality
   * @{author}: Alexander Genser
   */
  onSaveState(evt: any, action: Action) {
    this.undoRedoService.save(this.canvas, action);
  }

  
  //Socket methods

  connectToSocket(){
    this.socketService.connect("","",this.tokenStorage.getToken());
  }
  sendMessageToSocket(content: string, command: string){
    this.socketService.send(content,command);
  }

  disconnectSocket(){
    this.socketService.disconnect();
  }

}
//
