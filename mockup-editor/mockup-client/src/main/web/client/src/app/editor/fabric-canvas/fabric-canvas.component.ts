import { Component, OnInit, OnDestroy, ViewEncapsulation, ElementRef } from '@angular/core';
import { FabricmodifyService } from '../fabricmodify.service';
import { ManagePagesService } from '../managepages.service';
import { DndDropEvent } from 'ngx-drag-drop';
import { Subject } from 'rxjs';
import { Itransformation, Action } from './transformation.interface';
import { fabric } from '../extendedfabric';

import { UndoRedoService } from '../../shared/services/undo-redo.service';
import { Page } from 'src/app/shared/models/Page';
import * as Rulez from '../../../../node_modules/rulez.js/dist/js/rulez.min.js';
import { WorkspaceService } from '../workspace.service';

@Component({
  selector: 'app-fabric-canvas',
  templateUrl: './fabric-canvas.component.html',
  styleUrls: ['./fabric-canvas.component.scss'],
  encapsulation: ViewEncapsulation.None
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

  // Rulers
  rulerHorizontal: any;
  rulerVertical: any;
  showRulers: boolean = false;
  isLoading: boolean = true;

  selectedElement;

  // Mouse position
  cursorPosition: {
    x: number;
    y: number;
  } = { x: 0, y: 0};

  constructor(
    private modifyService: FabricmodifyService,
    private pagesService: ManagePagesService,
    private undoRedoService: UndoRedoService,
    private workSpaceService: WorkspaceService) {

      this.pagesService.isLoadingPage.subscribe((isLoading) => {
        //alert(isLoading);
        this.isLoading = isLoading;
        // Hide rulers during loading
        if (this.isLoading) {
          this.hideRulerLines();
        } else {
          this.showRulerLines();
          //Load rulers from localstorage if existant
          /* setTimeout(() => { this.loadRulersFromLocalStorage(); }
          , 500); */
        }
      });

      this.workSpaceService.deleteRulers.subscribe(() => {
        this.removeAllRulerLines();
      });
/* 
      this.workSpaceService.saveRulers.subscribe(() => {
        this.saveRulersToLocalStorage();
        alert('save Ruler');
      });

      this.workSpaceService.loadRulers.subscribe(() => {
        alert('load ruler');
        this.loadRulersFromLocalStorage();
      }); */
    }

  ngOnInit() {
    this.pagesService.createPage(900, 600);
    this.canvas = this.pagesService.getCanvas();


    this.Transformation = new Subject<Itransformation>();

    this.pagesService.pages.subscribe((pages) => {
      this.pages = pages;
    });

    this.pagesService.activePage.subscribe((page) => {
      this.activePage = page;
      if (!!page) {
        this.loadPage(this.activePage);
        this.setRulerDimensions(page.height, page.width);
      }
    });
    
    this.enableEvents();

    // React to changes when user clicks on hide/show ruler
    this.workSpaceService.showsRuler.subscribe((value) => {
      this.showRulers = value;
      if (this.showRulers) {
        //Rerender rulers with current dimensions.
        if (!!this.activePage && !!this.activePage.height && !!this.activePage.width) {
          this.setRulerDimensions(this.activePage.height, this.activePage.width);
        }
        this.showRulerLines();
      } else {
        this.hideRulerLines();
      }
    });

    this.loadRuler();

    this.modifyService.newForeignSelections();
  }

  onAddRulerLineH() {
    let div = document.createElement('div');
    div.className = 'rulerHLine rulerLine';
    div.style.marginLeft = this.cursorPosition.x + 'px';
    div.addEventListener('mousedown', (e) => {
      this.selectedElement = e.target});
    div.addEventListener('mouseup', (e) => {
      // Remove line if it goes below 5px
      if (this.cursorPosition.x < 5) {
        this.removeRulerLine(e);
      }
      this.selectedElement = null;
    });
    let workspace = document.querySelector('.workspace');
    workspace.insertBefore(div, workspace.childNodes[0]);
  }

  onAddRulerLineV() {
    let div = document.createElement('div');
    div.className = 'rulerVLine rulerLine';
    div.style.marginTop = this.cursorPosition.y + 'px';
    div.addEventListener('mousedown', (e) => {
      this.selectedElement = e.target});
    div.addEventListener('mouseup', (e) => {
      // Remove line if it goes below 5px
      if (this.cursorPosition.y < 5) {
        this.removeRulerLine(e);
      }
      this.selectedElement = null;
    });
    let workspace = document.querySelector('.workspace');
    workspace.insertBefore(div, workspace.childNodes[0]);
  }

  saveRulersToLocalStorage() {
    if (!!this.activePage && !!this.activePage.id) {
      let horizontalRulers = [];
      let verticalRulers = [];
  
      let rulers = document.getElementsByClassName('rulerHLine') as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < rulers.length; i++){
        let hRulerValue = rulers[i].style.marginLeft;
        horizontalRulers.push(hRulerValue);
      }
  
      let rulersV = document.getElementsByClassName('rulerVLine') as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < rulersV.length; i++) {
        let VRulerValue = rulersV[i].style.marginTop;
        verticalRulers.push(VRulerValue);
      }

      localStorage.removeItem(`rulers_${this.activePage.id}`);
  
      localStorage.setItem(`rulers_${this.activePage.id}`, JSON.stringify(
        {
          horizontalRulers,
          verticalRulers
        }
      ));
    }
  }

  loadRulersFromLocalStorage() {
    if (!!this.activePage && !!this.activePage.id) {
      let rulersString = localStorage.getItem(`rulers_${this.activePage.id}`);
      if (!!rulersString) {
        let rulers = JSON.parse(rulersString);
        //Load horizontal rulers
        let horizontalRulers = rulers.horizontalRulers as [string];
        for (let i = 0; i < horizontalRulers.length; i++){
          // Add ruler
          let div = document.createElement('div');
          div.className = 'rulerHLine rulerLine';
          div.style.marginLeft = horizontalRulers[i];
          div.addEventListener('mousedown', (e) => {
            this.selectedElement = e.target});
          div.addEventListener('mouseup', (e) => {
            // Remove line if it goes below 5px
            if (this.cursorPosition.x < 5) {
              this.removeRulerLine(e);
            }
            this.selectedElement = null;
          });
          let workspace = document.querySelector('.workspace');
          workspace.insertBefore(div, workspace.childNodes[0]);
        }

        //Load vertical rulers
        let verticalRulers = rulers.verticalRulers as [string];
        for (let i = 0; i < verticalRulers.length; i++){
          // Add ruler
          let div = document.createElement('div');
          div.className = 'rulerVLine rulerLine';
          div.style.marginTop = verticalRulers[i];
          div.addEventListener('mousedown', (e) => {
            this.selectedElement = e.target});
          div.addEventListener('mouseup', (e) => {
            // Remove line if it goes below 5px
            if (this.cursorPosition.y < 5) {
              this.removeRulerLine(e);
            }
            this.selectedElement = null;
          });
          let workspace = document.querySelector('.workspace');
          workspace.insertBefore(div, workspace.childNodes[0]);
        }
      }
    }
    
  }

  removeRulerLine(e) {
    if (!!e && !!e.target) {
      e.target.parentNode.removeChild(e.target);
    }
  }

  hideRulerLines() {
    //alert('hideRulerLines');
    var elems = document.querySelectorAll('.rulerLine');
    var index = 0, length = elems.length;
    for ( ; index < length; index++) {
        elems[index].classList.add("hidden");
    }
  }

  showRulerLines() {
    var elems = document.querySelectorAll('.rulerLine');
    var index = 0, length = elems.length;
    for ( ; index < length; index++) {
        elems[index].classList.remove("hidden");
    }
  }

  removeAllRulerLines() {
    document.querySelectorAll('.rulerLine').forEach((el) => {
      el.parentNode.removeChild(el);
    });
  }

  onMouseEnter(e) {
  }

  onMouseLeave(e) {
  }

  onMouseMove(e, canvasWrapper: HTMLElement, horizontalHandler: HTMLElement, verticalHandler: HTMLElement) {
    let bounds = canvasWrapper.getBoundingClientRect();
    this.cursorPosition.x = e.clientX - bounds.left;
    this.cursorPosition.y = e.clientY - bounds.top;
    horizontalHandler.style.marginLeft = `${this.cursorPosition.x }px`;
    verticalHandler.style.marginTop = `${this.cursorPosition.y}px`;
    //console.log(`x: ${x} y: ${y}`);
    if (!!this.selectedElement) {
      if (this.selectedElement.classList.contains('rulerHLine')) {
        // Move horizontally
        this.selectedElement.style.marginLeft = `${this.cursorPosition.x }px`;
      } else if (this.selectedElement.classList.contains('rulerVLine')){
        // Move vertically
        this.selectedElement.style.marginTop = `${this.cursorPosition.y }px`;
      }
    }
  }

  /**
   * Sets dimensions of rulers (height, number);
   */
  private setRulerDimensions(height: number, width: number) {
    if (height >= 0 && width >= 0) {
      document.getElementById('svgH').setAttribute("width", `${width}`);
      document.getElementById('svgV').setAttribute("height", `${height}`);
      this.rulerHorizontal.resize();
      this.rulerVertical.resize();
    }
  }

  /**
   * Renders rulers initially.
   */
  private loadRuler() {
    this.rulerHorizontal = new Rulez({
      element: document.getElementById('svgH'),
      layout: 'horizontal',
      alignment: 'top',
    });
    this.rulerHorizontal.render();

    this.rulerVertical = new Rulez({
      element: document.getElementById('svgV'),
      layout: 'vertical',
      alignment: 'left',
      textDefaults: {
        rotation: -90,
        centerText: {
            by: 'height',
            operation: 'sum' //'sum' or 'sub'
        }
      },
    });
    this.rulerVertical.render();
  }

  private loadPage(page: Page) {
    if (!!page) {
      this.modifyService.clearAll(this.canvas);
      this.modifyService.setHeight(this.canvas, page.height);
      this.modifyService.setWidth(this.canvas, page.width);
      //console.log(`loadPage with data: ${page.page_data}`);
      if (!!page.page_data) {
        this.modifyService.loadFromJSON(this.canvas, page.page_data);
            //this.pagesService.loadGrid(2000,2000);
        this.pagesService.updateGrid();

        // saving initial State
        this.undoRedoService.saveInitialState();
      }
      //console.log(`loadPage: height ${page.height} width ${page.width} page data: ${page.page_data}`);
    }

  }

  onCreatePage() {
    this.pagesService.addPage(null);
  }

  /**
   * enables all events we listen to
   * - before:transform: fired on click that could lead to a drag/rotate/scale
   * - mouse:up: fired on mouse up while on the canvas, used for unlock (every before:transform is succeeded by mouse:up)
   * - object:modified: fired when an object is scaled/rotated/move by user mouse action ONLY, NOT by setting properties
   *  the rest is self explanatory, for more details check 
   *  http://fabricjs.com/events
   *  http://fabricjs.com/docs/fabric.Canvas.html
   */
  enableEvents() {
    this.canvas
      .on('before:transform', (event) => { this.statelessTransfer(event.transform, Action.LOCK); })
      .on('mouse:up',(event) => { if(event.target !== null) this.statelessTransfer(event, Action.UNLOCK) })
      .on('object:added', (evt) => { this.onTransformation(evt, Action.ADDED); })
      .on('object:modified', (evt) => { this.onTransformation(evt, Action.MODIFIED); })
      .on('object:removed', (evt) => { this.onTransformation(evt, Action.REMOVED); })
      .on('selection:created',(event) => { this.statelessTransfer(event,Action.SELECTIONMODIFIED) })
      .on('selection:updated',(event) => { this.statelessTransfer(event,Action.SELECTIONMODIFIED) })
      .on('before:selection:cleared',(event) => { this.statelessTransfer({'target':null},Action.SELECTIONMODIFIED) })
      .on('after:render',(event) => { this.onAfterRender(event) })
    }
  disableEvents() {
    this.canvas
      .off('before:transform', (event) => { this.statelessTransfer(event.transform, Action.LOCK); })
      .off('mouse:up',(event) => { if(event.target !== null) this.statelessTransfer(event, Action.UNLOCK) })
      .off('object:added', (evt) => { this.onTransformation(evt, Action.ADDED); })
      .off('object:modified', (evt) => { this.onTransformation(evt, Action.MODIFIED); })
      .off('object:removed', (evt) => { this.onTransformation(evt, Action.REMOVED); })
      .off('selection:created',(event) => { this.statelessTransfer(event,Action.SELECTIONMODIFIED) })
      .off('selection:updated',(event) => { this.statelessTransfer(event,Action.SELECTIONMODIFIED) })
      .off('before:selection:cleared',(event) => { this.statelessTransfer({'target':null},Action.SELECTIONMODIFIED) })
      .off('after:render',(event) => { this.onAfterRender(event) })
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
      } else if (event.keyCode === 27) { // Esc key
        this.modifyService.clearSelection(canvas);
      }
    }
  }

  /**
   * saves the elements in the workspace as JSON string in the local storage
   */
  onSaveToLocalStorage() {
    const json = JSON.stringify(this.canvas);
    //console.log(json);
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
    this.modifyService.loadImageFromURL(canvas, url);
  }

  /**
   *
   * @param evt - Event-object, contains, the modified objects
   * @param action - one of the defined Actions,
   * which will be transmitted s. transformation.interface
   */
  onTransformation(evt, action: Action) {
    let transObject = evt.target;
    //console.log(JSON.stringify(evt));
    console.log(`${action} : ${transObject.uuid}`);
    if (transObject.sendMe) {
      //this includes the "do not propagate this change" already on the send level, so minimal checks are necessary on the recieving side
      transObject.sendMe = false;

      let typ = transObject.type
      let sendArray = [];
      if(typ==='activeSelection') {
        //Elements in groups/selections are orientated relative to the group and not to the canvas => selection is rebuild on every message to propagate the changes to the objects.
        
        //console.log('selection: '+JSON.stringify(transObject))
        
        //the objects to be saved must be cloned seperately, otherwise it interferes with the selection
        let undoArray = [];
        let oldRenderAddRemove = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = false;
        this.canvas.discardActiveObject();
        transObject.forEachObject((current) => {
          let newObj = this.getObjectByUUID(current.uuid);
          //must not be cloned, or active selection will stop working after one modification
          sendArray.push(newObj);
          newObj.clone((obj) => {
            undoArray.push(obj);
            obj.uuid = newObj.uuid;
            obj.sendMe = false;//? should be needed but its nonexistence had no effect, treat with care.
            this.pagesService.sendMessageToSocket(obj, action);
            //console.log('newObj: ' + JSON.stringify(obj) + ', action: ' + action);
          })
        });

        if(action === Action.REMOVED) this.undoRedoService.setCurrentlyModifiedObject(undoArray);
        this.undoRedoService.save(undoArray,action);
        //fancy canvas magic to ensure the selection behaves properly
        var newSelection = new fabric.ActiveSelection(sendArray, {canvas:this.canvas});

        //console.log('new Selection: ' + JSON.stringify(newSelection));
        this.canvas.renderOnAddRemove = oldRenderAddRemove;
        this.canvas.setActiveObject(newSelection);

      } else {
        sendArray.push(transObject);
        this.pagesService.sendMessageToSocket(transObject,action);
        
        if(action === Action.REMOVED) this.undoRedoService.setCurrentlyModifiedObject(sendArray);
        this.undoRedoService.save(sendArray,action);
      }
    }

      //the object needs to be available again regardless of whether or not it was a remote access.
      transObject.sendMe = true;

  }
  /**
   * Sends a message to the server that does not contain state information, only an object's id
   * @param evt event to act upon
   * @param action the action that should be transmitted to the server
   */
  statelessTransfer(evt, action:string) {
    let selectedObj = evt.target;
    let sendArray = [];
    if(action === Action.SELECTIONMODIFIED) sendArray.push(null);
    if(selectedObj) {
      if(selectedObj.type === 'activeSelection') {
        selectedObj.getObjects().forEach( (current) => {
          sendArray.push(this.cloneMemberofGroup(current,selectedObj));
        });
      } else {
        selectedObj.clone((o) => {
          sendArray.push(o);
        });
      }
    }
    //if it was a lock, a change is about to happen, so we make the pre-modified state available.
    if(action === Action.LOCK) this.undoRedoService.setCurrentlyModifiedObject(sendArray);
    let _this = this;
    sendArray.forEach((current) => {
      _this.pagesService.sendMessageToSocket(current,action);
    })

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


  /**
 * Checks an array if it contains a certain fabric object with the given uuid.
 * For details see the called method
 * 
 * @param uuid the uuid of the object to be found
 * @returns the object if found, undefined otherwise
 */
getObjectByUUID(uuid: string) {
    
  return this.modifyService.getObjectByUUID(uuid,this.canvas.getObjects());
}
  ngOnDestroy() {
    // Delete pages and the current active page from store. (Unselect current project)
    this.pagesService.clearActivePage();
    this.pagesService.clearPages();
    this.canvas.dispose();

    // pretend to have deselected all elements.
    this.pagesService.sendMessageToSocket(null,Action.SELECTIONMODIFIED);
  }
  /**
   * Undo Redo - functionality
   * @{author}: Alexander Genser
   * this was refactored and stays here for documentary purposes for now
   */
  /*onSaveState(evt: any, action: Action) {
    const saveObject = evt.target;
    const objects = [];
    if (saveObject.type === 'activeSelection') {
        saveObject.forEachObject( (obj) => {
          objects.push(obj);
        });
    } else {
      objects.push(saveObject);
      // console.log('clone test\nprepushed id: '+saveObject.uuid+'\npostpush id: '+objects[0].uuid)
    }
    this.undoRedoService.save(objects, action);
  }*/

  /**
  * Is called after render to draw boxes around objects marked by other users 
  */
  onAfterRender(event) {
    let selections = this.modifyService.getForeignSelections();
    let currentSelection = this.canvas.getActiveObject();
    selections.forEach((value,key,map) => {
      value.forEach((current) => {
        if(current === null) return;

        let temp = this.cloneMemberofGroup(current,currentSelection);

        if(temp === null) temp = current;
        this.canvas.contextContainer.strokeStyle = '#FF0000';
        var bound = temp.getBoundingRect();
        this.canvas.contextContainer.strokeRect(
          bound.left - 2.5,
          bound.top - 2.5,
          bound.width+5,
          bound.height+5
        );
      })
    })
  }
  
  /**
   * Clones an object from a group and modifies it so its position is relativ to the canvas
   * origin again. Returns null if the object is null, group is not a valid group, or if
   * the provided object was not a member of the provided group.
   * @param object object to clone
   * @param group group the object belongs to
   * @returns the clone of the object of the group, or null 
   * 
   */
  cloneMemberofGroup(object:any, group:any):any {
    if(!group || !(group.type === 'activeSelection' || group.type === 'group')) return null;
    else {
      let temp = null;
      let groupedObjects = group.getObjects();
      if(groupedObjects.find((o) => o.uuid == object.uuid)) {
        object.clone((clone) => {
          FabricmodifyService.calcExtractFromGroup(clone,group);
          temp = clone;
        });
      }
      return temp;
    }
  }

  /**
   * 
   */
}
