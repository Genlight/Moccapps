import { Component, OnInit, OnDestroy } from '@angular/core';
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
  styleUrls: ['./fabric-canvas.component.scss']
})

export class FabricCanvasComponent implements OnInit, OnDestroy {

  // Fabric canvas. Note: this is not html canvas.
  // http://fabricjs.com/
  private canvas: any;

  // AsyncSubject is used, because we don't want to get notified, if we update
  // the canvas with Transformation from other users. AsyncSubject works so, that
  // only new events will be 'observed'.
  public Transformation: Subject<Itransformation>;

  pages: Page[];
  activePage: Page;

  // Rulers
  rulerHorizontal: any;
  rulerVertical: any;
  showRulers: boolean = false;

  constructor(
    private modifyService: FabricmodifyService,
    private pagesService: ManagePagesService,
    private undoRedoService: UndoRedoService,
    private workSpaceService: WorkspaceService) { }

  // TODO: manage canvas for different pages and not just one
  ngOnInit() {
    this.pagesService.createPage(900, 600);
    this.canvas = this.pagesService.getCanvas();

    // saving initial state of canvas
    this.undoRedoService.save(this.canvas, Action.PAGECREATED);
    this.enableEvents();
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

    // React to changes when user clicks on hide/show ruler 
    this.workSpaceService.showsRuler.subscribe((value) => {
      this.showRulers = value;
      //Rerender rulers with current dimensions.
      if (!!this.activePage && !!this.activePage.height && !!this.activePage.width) {
        this.setRulerDimensions(this.activePage.height, this.activePage.width);
      }
    });

    this.loadRuler();
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
      if (!!page.page_data) {
        this.modifyService.loadFromJSON(this.canvas, page.page_data);
      }
      
      console.log(`loadPage: height ${page.height} width ${page.width} page data: ${page.page_data}`);
    }
    //this.pagesService.loadGrid(2000,2000);
    this.pagesService.updateGrid();
  }

  onCreatePage() {
    this.pagesService.createInitialPage();
  }

  /**
   * for switching event-listener on and off
   */
  enableEvents() {
    this.canvas
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
    const transObject = evt.target;
    const next = ((element) => {
      if (typeof this.Transformation === 'undefined') {
        this.Transformation = new Subject<any>();
      }
      this.Transformation.next({ element, action });
      console.log(`${action} : ${element.uuid}`);
    });
    if (transObject.type === 'activeSelection') {
      this.canvas.getActiveObject().forEachObject(next);
      return;
    }
    if (Array.isArray(transObject)) {
      transObject.forEach(next);
    } else {
      next(transObject);
    }
  }
  async applyTransformation(object: any) {
    const old = this.getObjectByUUID(object.uuid);
    this.canvas.removeListeners();
    // if not existed, jsut add it
    if (typeof old === 'undefined') {
      await this.canvas.loadFromJSON(object, () => {
        console.log(`Element added by other user: ${object.uuid}`);
      }).requestRenderAll();
    } else {
      await this.canvas.remove(old).loadFromJSON(object, () => {
        console.log(`Element changed by other user: ${object.uuid}`);
      }).requestRenderAll();
    }
    this.enableEvents();
  }
  /**
   * gleicher Ablauf wie applyTransformation, nur dass hier ein fabric-Objekt entfernt wird
   * @param object - ein fabric.Object, entspricht einem kompletten Fabric-Objekt,
   * welches per toJSON() serialissiert/ deserialisiert wurde
   */
  applyRemoval(object: any) {
    const old = this.getObjectByUUID(object.uuid);
    if (typeof old !== 'undefined') {
      this.canvas.removeListeners();
      this.canvas.remove(old);
      this.enableEvents();
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
    this.undoRedoService.save(this.canvas, action);
  }
}
//
