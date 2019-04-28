import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FabricmodifyService } from '../fabricmodify.service';
import { ManagePagesService } from '../managepages.service';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { Observable } from 'rxjs';

import { Itransformation, Action } from './transformation.interface';

@Component({
  selector: 'app-fabric-canvas',
  templateUrl: './fabric-canvas.component.html',
  styleUrls: ['./fabric-canvas.component.scss']
})

export class FabricCanvasComponent implements OnInit {

  // Fabric canvas. Note: this is not html canvas.
  // http://fabricjs.com/
  private canvas: any;

  // AsyncSubject is used, because we don't want to get notified, if we update
  // the canvas with Transformation from other users. AsyncSubject works so, that
  // only new events will be 'observed'.
  public Transformation: AsyncSubject<any>;

  constructor(private modifyService: FabricmodifyService, private managePagesService: ManagePagesService) { }

  // TODO: manage canvas for different pages and not just one
  ngOnInit() {
    this.managePagesService.createPage();
    this.canvas = this.managePagesService.getCanvas();
    this.enableEvents();
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

  onAddText() {
    this.modifyService.addText(this.canvas, 'Text');
  }

  onRemove() {
    this.modifyService.removeElement(this.canvas);
  }

  onGroup() {
    this.modifyService.group(this.canvas);
  }

  onUngroup() {
    this.modifyService.ungroup(this.canvas);
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
        this.Transformation = new AsyncSubject<any>();
      }
      this.Transformation.next({element, Action: action });
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
}
