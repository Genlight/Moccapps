import { Component, OnInit, OnDestroy } from '@angular/core';
import { FabricmodifyService } from '../fabricmodify.service';
import { ManagePagesService } from '../managepages.service';
import { Subject } from 'rxjs';

import { Itransformation, Action } from './transformation.interface';

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

  constructor(private modifyService: FabricmodifyService, private managePagesService: ManagePagesService) { }

  // TODO: manage canvas for different pages and not just one
  ngOnInit() {
    this.managePagesService.createPage(900, 600);
    this.canvas = this.managePagesService.getCanvas();
    this.enableEvents();
    this.Transformation = new Subject<Itransformation>();
  }

  /**
   * for switching event-listener on and off
   */
  enableEvents() {
    this.canvas
      .on('object:added', (evt) => { this.onTransformation(evt, Action.ADDED); })
      .on('object:modified', (evt) => { this.onTransformation(evt, Action.MODIFIED); })
      .on('object:removed', (evt) => { this.onTransformation(evt, Action.REMOVED); });
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

  /**
   *
   * @param evt - Event-object, contains, the modified objects
   * @param action - one of the defined Actions,
   * which will be transmitted s. transformation.interface
   */
  onTransformation(evt, action: Action) {
    const transObject = evt.target;
    const next = ((element) => {
      if ( typeof this.Transformation === 'undefined') {
        this.Transformation = new Subject<any>();
      }
      this.Transformation.next({element, action });
      console.log(`${action} : ${element.uuid }`);
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
  /**
   * Wendet übergebene Canvas-Objekt-Transformationen auf das Canvas an.
   * Falls keine UUID gefunden wird, wird eine Exception geworfen (Ausnahme: element:added)
   * @param object - ein fabric.Object, entspricht einem kompletten Fabric-Objekt,
   * welches per toJSON() serialissiert/ deserialisiert wurde
   */
  async applyTransformation(object: any) {
    const old = this.getObjectByUUID(object.uuid);
    this.canvas.removeListeners();
    // if not existed, jsut add it
    if (typeof old === 'undefined') {
      await this.canvas.loadFromJSON(object, () => {
        console.log(`Element added by other user: ${object.uuid}`);
      } ).requestRenderAll();
    } else {
      await this.canvas.remove(old).loadFromJSON(object, () => {
        console.log(`Element changed by other user: ${object.uuid}`);
      } ).requestRenderAll();
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
    return this.canvas.getObjects().find((o) => o.uuid === uuid );
  }
  ngOnDestroy() {

  }
}
