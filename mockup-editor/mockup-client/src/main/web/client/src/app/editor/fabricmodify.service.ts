import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { fabric } from './extendedfabric';
import { Group } from 'fabric';
import { ManageGroupsService } from './managegroups.service';
import { Action } from './fabric-canvas/transformation.interface';
import {ManagePagesService} from "./managepages.service";
let savedElements = null;

@Injectable({
  providedIn: 'root'
})

export class FabricmodifyService {
  canvas: any;

  constructor(private groupService: ManageGroupsService
  ) { }

  /* groups active elements in given canvas if more than one element is selected */
  group(canvas: any) {
    if (!canvas.getActiveObject()) {
      return;
    }
    if (canvas.getActiveObject().type !== 'activeSelection') {
      return;
    }
    let temp = canvas.getActiveObject().toGroup();
    temp.set('dirty',true);
    temp = (temp as Group);
    this.groupService.add(temp);
  }

  clearAll(canvas: any) {
    canvas.clear();
    this.setBackgroundColor(canvas, "white");
  }

  loadFromJSON(canvas: any, json: string) {
    canvas.loadFromJSON(json, () => {
      canvas.renderAll();
    });
  }

  exportToJson(canvas: any): string {
    const json = JSON.stringify(canvas);
    return json;
  }

  setHeight(canvas: any, height: number) {
    canvas.setHeight(height);
  }

  setWidth(canvas: any, width: number) {
    canvas.setWidth(width);
  }

  setBackgroundColor(canvas: any, color: string) {
    canvas.backgroundColor = color;
    canvas.renderAll();  
  }

  /* ungroups elements in given canvas if a group of elements is selected */
  ungroup(canvas: any) {
    const activeGrp = canvas.getActiveObject();
    if (!activeGrp) {
      return;
    }
    if (activeGrp.type !== 'group') {
      return;
    }
    let temp = (activeGrp as Group);
    this.groupService.remove(temp);
    activeGrp.toActiveSelection();
    canvas.requestRenderAll();

  }

  /* adds a text label to the given canvas */
  addText(canvas: any, text: string) {
    const label = new fabric.Textbox(text);
    canvas.add(label);
  }

  /* adds a white circle with a black border to the given canvas */
  addCircle(canvas: any) {
    const circle = new fabric.Circle({ radius: 60, fill: 'white', left: 10, right: 10, stroke: 'black', strokeWidth: 2 });
    canvas.add(circle);
  }

  /* adds a white square with a black border to the given canvas */
  addSquare(canvas: any) {
    const square = new fabric.Rect({ width: 100, height: 100, fill: 'white', left: 10, right: 10, stroke: 'black', strokeWidth: 2 });
    canvas.add(square);
  }

  /* removes one or more selected elements or groups of elements from the given canvas */
  removeElement(canvas: any) {
    if (!canvas.getActiveObject()) {
      return;
    }
    canvas.getActiveObjects().forEach((obj) => {
      canvas.remove(obj);
    });
    canvas.discardActiveObject().renderAll();
  }

  /* activates or deactivates a free drawing mode on the given canvas */
  drawingMode(canvas: any) {
    if (canvas.isDrawingMode === false) {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = 10;
    } else {
      canvas.isDrawingMode = false;
    }
  }

  /* brings selected elements to front of the given canvas */
  bringToFront(canvas: any) {
    if (!canvas.getActiveObject()) {
      return;
    }
    canvas.bringToFront(canvas.getActiveObject());
  }

  /* moves selected elements closer to the front of the given canvas */
  bringForward(canvas: any) {
    if (!canvas.getActiveObject()) {
      return;
    }
    canvas.bringForward(canvas.getActiveObject());
  }

  /* moves selected elements closer to the back of the given canvas */
  sendBackwards(canvas: any) {
    if (!canvas.getActiveObject()) {
      return;
    }
    canvas.sendBackwards(canvas.getActiveObject());
  }

  /* sends selected elements to the back of the given canvas */
  sendToBack(canvas: any) {
    if (!canvas.getActiveObject()) {
      return;
    }
    canvas.sendToBack(canvas.getActiveObject());
  }

  /* copies active elments in the given canvas and temporarily saves them in a variable */
  copyElement(canvas: any) {
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().clone(function(cloned) {
        savedElements = cloned;
      });
    }
  }

  /* pastes previously copied elements to the given canvas
    (based on http://fabricjs.com/copypaste) */
  pasteElement(canvas: any) {
    if (savedElements == null) {
      return;
    }
    savedElements.clone(function(clonedObj) {
      canvas.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
      });
      if (clonedObj.type === 'activeSelection') {
        // active selection needs a reference to the canvas.
        clonedObj.canvas = canvas;
        clonedObj.forEachObject(function(obj) {
          canvas.add(obj);
        });
        // this should solve the unselectability
        clonedObj.setCoords();
      } else {
        canvas.add(clonedObj);
      }
      canvas.setActiveObject(clonedObj);
      canvas.requestRenderAll();
    });
  }

  /* copies active elements from the given canvas and then removes them */
  cutElement(canvas: any) {
    this.copyElement(canvas);
    this.removeElement(canvas);
  }

  /* copies active elements from the given canvas and pastes them to the canvas */
  duplicateElement(canvas: any) {
    this.copyElement(canvas);
    this.pasteElement(canvas);
  }
  /**
   * Wendet übergebene Canvas-Objekt-Transformationen auf das Canvas an.
   * Falls keine UUID gefunden wird, wird eine Exception geworfen (Ausnahme: element:added)
   * @param object - ein fabric.Object, entspricht einem kompletten Fabric-Objekt,
   * welches per toJSON() serialissiert/ deserialisiert wurde
   */
  // async applyTransformation(object: any) {
  //   const canvas = this.managepagesService.getCanvas();
  //   const old = this.getObjectByUUID(object.uuid);
  //   this.disableEvents();
  //   // if not existed, jsut add it
  //   if (typeof old === 'undefined') {
  //     await canvas.loadFromJSON(object, () => {
  //       console.log(`Element added by other user: ${object.uuid}`);
  //     }).requestRenderAll();
  //   } else {
  //     await canvas.remove(old).loadFromJSON(object, () => {
  //       console.log(`Element changed by other user: ${object.uuid}`);
  //     }).requestRenderAll();
  //   }
  //   this.enableEvents();
  // }
  //
  // /**
  //  * gleicher Ablauf wie applyTransformation, nur dass hier ein fabric-Objekt entfernt wird
  //  * @param object - ein fabric.Object, entspricht einem kompletten Fabric-Objekt,
  //  * welches per toJSON() serialissiert/ deserialisiert wurde
  //  */
  // applyRemoval(object: any) {
  //   const canvas = this.managepagesService.getCanvas();
  //   const old = this.getObjectByUUID(object.uuid);
  //   if (typeof old !== 'undefined') {
  //     this.disableEvents();
  //     canvas.remove(old);
  //     this.enableEvents();
  //   }
  // }
  //
  // getObjectByUUID(uuid: string) {
  //   this.canvas = this.managepagesService.getCanvas();
  //   return this.canvas.getObjects().find((o) => o.uuid === uuid);
  // }
  //
  // enableEvents() {
  //   this.managepageService.getCanvas()
  //     .on('object:added', (evt) => { this.onTransformation(evt, Action.ADDED); })
  //     .on('object:modified', (evt) => { this.onTransformation(evt, Action.MODIFIED); })
  //     .on('object:removed', (evt) => { this.onTransformation(evt, Action.REMOVED); })
  //     .on('object:added', (evt) => { this.onSaveState(evt, Action.ADDED); })
  //     .on('object:modified', (evt) => { this.onSaveState(evt, Action.MODIFIED); })
  //     .on('object:removed', (evt) => { this.onSaveState(evt, Action.REMOVED); });
  // }
  //
  // disableEvents() {
  //   this.managepageService.getCanvas().removeListeners();
  // }
}
