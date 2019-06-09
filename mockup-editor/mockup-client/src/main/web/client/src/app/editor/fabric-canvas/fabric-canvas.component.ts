import { Component, OnInit, OnDestroy } from '@angular/core';
import { FabricmodifyService } from '../fabricmodify.service';
import { ManagePagesService } from '../managepages.service';
import { DndDropEvent } from 'ngx-drag-drop';
import { Subject } from 'rxjs';
import { Itransformation, Action } from './transformation.interface';
import { fabric } from '../extendedfabric';
import { SocketConnectionService } from '../../socketConnection/socket-connection.service';

import { UndoRedoService } from '../../shared/services/undo-redo.service';
import { Page } from 'src/app/shared/models/Page';

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

  pages: Page[];
  activePage: Page;

  constructor(
    private modifyService: FabricmodifyService,
    private pagesService: ManagePagesService,
    private undoRedoService: UndoRedoService) { }

  // TODO: manage canvas for different pages and not just one
  ngOnInit() {
    this.pagesService.createPage(900, 600);
    this.canvas = this.pagesService.getCanvas();

    // saving initial State
    this.undoRedoService.saveInitialState();
    this.enableEvents();
    this.Transformation = new Subject<Itransformation>();

    this.pagesService.pages.subscribe((pages) => {
      this.pages = pages;
    });

    this.pagesService.activePage.subscribe((page) => {
      this.activePage = page;
      if (!!page) {
        this.loadPage(this.activePage);
      }
    });
  }

  private loadPage(page: Page) {
    if (!!page) {
      this.modifyService.clearAll(this.canvas);
      this.modifyService.setHeight(this.canvas, page.height);
      this.modifyService.setWidth(this.canvas, page.width);
      if (!!page.page_data) {
        this.modifyService.loadFromJSON(this.canvas, page.page_data);
      }
      
      console.log(`loadPage: height ${page.height} width ${page.width} page data: ${page.page_data}`);
    }
  }

  onCreatePage() {
    this.pagesService.addPage("Page 1");
  }

  enableEvents() {
    this.canvas
      .on('before:transform', (event) => {
        this.pagesService.sendMessageToSocket(event.transform.target.uuid, 'lock');
      }, )
      .on('object:added', (evt) => { this.onTransformation(evt, Action.ADDED); })
      .on('object:modified', (evt) => { this.onTransformation(evt, Action.MODIFIED); })
      .on('object:removed', (evt) => { this.onTransformation(evt, Action.REMOVED); })
      /*.on('object:added', (evt) => { this.onSaveState(evt, Action.ADDED); })
      .on('object:modified', (evt) => { this.onSaveState(evt, Action.MODIFIED); })
      .on('object:removed', (evt) => { this.onSaveState(evt, Action.REMOVED); });*/;
    }
  disableEvents() {
    this.canvas
      .off('object:added', (evt) => { this.onTransformation(evt, Action.ADDED); })
      .off('object:modified', (evt) => { this.onTransformation(evt, Action.MODIFIED); })
      .off('object:removed', (evt) => { this.onTransformation(evt, Action.REMOVED); })
      .off('object:added', (evt) => { this.onSaveState(evt, Action.ADDED); })
      .off('object:modified', (evt) => { this.onSaveState(evt, Action.MODIFIED); })
      .off('object:removed', (evt) => { this.onSaveState(evt, Action.REMOVED); });
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
    const canvas = this.pagesService.getCanvas();
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
    const canvas = this.pagesService.getCanvas();
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
    console.log(`${action} : ${transObject.uuid}`);
    if (transObject.sendMe) {
      //this includes the "do not propagate this change" already on the send level, so minimal checks are necessary on the recieving side
      transObject.sendMe = false;
      //this.sendMessageToSocket(JSON.stringify(transObject),action);
      this.onSaveState(evt, action);


      let typ = transObject.type
      //let objectsToSend = [transObject];
      //console.log('type: '+typ+', transObj: '+JSON.stringify(transObject));


      if(typ==='activeSelection') {
        //Elements in groups/selections are orientated relative to the group and not to the canvas => recalculation is necessary
        console.log('selection: '+JSON.stringify(transObject))
        let selectionLeft = transObject.left
        let selectionTop = transObject.top
        let selectionWidth = transObject.width
        let selectionHeight = transObject.height

        transObject.forEachObject((current) => {
          current.clone( (obj) => {
            obj.top = selectionTop + (selectionHeight/2 + obj.top);
            obj.left = selectionLeft + (selectionWidth/2 + obj.left);
            obj.uuid = current.uuid;
            this.pagesService.sendMessageToSocket(obj, action);
            console.log('current: ' + JSON.stringify(obj) + ', action: ' + action);
          });

        });
      } else {
        this.pagesService.sendMessageToSocket(transObject,action);
      }

    }

    //this needs to happen externally if the change was made from somebody else; the state of the canvas needs to be accuratly reflected
    else this.undoRedoService.setState(this.canvas, action);

      //the object needs to be available again regardless of whether or not it was a remote access.
      //If the locking strategy involves sending it to the sender as well, this might need to be put into an else block (untested proposition)
      transObject.sendMe = true;
  }
  forEachTransformedObj(evt, next) {
    const transObject = evt.target;
    if (transObject.type === 'activeSelection') {
      evt.transform.target.objects.forEach(next);
      // this.canvas.getActiveObject().forEachObject(next);
      return;
    }
    if (Array.isArray(transObject)) {
      transObject.forEach(next);
    } else {
      next(transObject);
    }
  }


  getObjectByUUID(uuid: string) {
    return this.canvas.getObjects().find((o) => o.uuid === uuid);
  }
  ngOnDestroy() {
    // Save the loaded page before leaving.
    this.pagesService.saveActivePage();

    // Delete pages and the current active page from store. (Unselect current project)
    this.pagesService.clearActivePage();
    this.pagesService.clearPages();
    this.canvas.dispose();
  }
  /**
   * Undo Redo - functionality
   * @{author}: Alexander Genser
   */
  onSaveState(evt: any, action: Action) {
    const saveObject = evt.target;
    const objects = [];
    if (saveObject.type === 'activeSelection') {
        saveObject.forEachObject( (obj) => {
          objects.push(obj);
        });
    } else {
      objects.push(saveObject);
      console.log('clone test\nprepushed id: '+saveObject.uuid+'\npostpush id: '+objects[0].uuid)
    }
    this.undoRedoService.save(objects, action);
  }


}
//
