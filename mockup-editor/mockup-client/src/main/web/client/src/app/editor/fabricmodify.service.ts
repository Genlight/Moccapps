import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { fabric } from './extendedfabric';
import { ManagePagesService } from './managepages.service';
import { Action } from './fabric-canvas/transformation.interface';
import { socketMessage } from '../socketConnection/socketMessage';
let savedElements = null;

@Injectable({
  providedIn: 'root'
})

export class FabricmodifyService {
  canvas: any;

  constructor(
    private managepagesService: ManagePagesService
  ) { }

  /* groups active elements in given canvas if more than one element is selected */
  group(canvas: any) {
    if (!canvas.getActiveObject()) {
      return;
    }
    if (canvas.getActiveObject().type !== 'activeSelection') {
      return;
    }
    canvas.getActiveObject().toGroup();
    canvas.requestRenderAll();
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
  
  applyTransformation(message:socketMessage) {
    let transObj = JSON.parse(message.content)

    const old = this.getObjectByUUID(transObj.uuid);
    //console.log('test: applyTransformation'+', transObj: '+transObj+', sendMe: '+ transObj.sendMe+', transObjuuid: ' + transObj.uuid + ', retrievedObj: ' + old +', JSONmessage:'+JSON.stringify(message));
    //TODO: "just adding" does not work yet, needs to be fixed 
      var _this = this;
      console.log('pre enlivenment: '+JSON.stringify(transObj));

      fabric.util.enlivenObjects([transObj], function(objects) {
        objects.forEach(function(o) {
          
            console.log('after enlivenment: '+JSON.stringify(o));
            o.uuid = transObj.uuid;
            
            if(message.command === Action.ADDED){
              o.sendMe = false;
              _this.canvas.add(o);
              }
            else if(message.command === Action.MODIFIED) {
              
            //fallback to add if no such element exists, can be removed and replaced by error message if desired
            if(old === undefined) {
              o.sendMe = false;
              _this.canvas.add(o);
            } else {
              let activeSelection = _this.canvas.getActiveObjects();
              console.log('contains test\nselection: '+JSON.stringify(activeSelection)+'\nobject: '+o.uuid);              
              console.log('\ncontain result: '+activeSelection.indexOf(o));
              let keys = Object.keys(o);
              keys.forEach(function(key) {
                //console.log(`assigning ${o[key]} to ${key}, old value: ${old[key]}`)
                old[key] = o[key];
              });
              //this is necessary to reliably render all changes of the object
              old.setCoords();
            } 
          }
            else if(message.command === Action.REMOVED) {
              //if no such element exists we are done here
              if(old !== undefined) {
              old.sendMe = false;
              _this.canvas.remove(old);
            }
          }
        });
        _this.canvas.renderAll();
    });
      console.log('after parse.');   
  }
  
 
  getObjectByUUID(uuid: string) {
    this.canvas = this.managepagesService.getCanvas();
    return this.canvas.getObjects().find((o) => o.uuid === uuid);
  }
}
