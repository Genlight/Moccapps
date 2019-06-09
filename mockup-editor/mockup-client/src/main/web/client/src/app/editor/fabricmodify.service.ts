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
    //private managePagesService:ManagePagesService
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
      canvas.getActiveObject().clone(function (cloned) {
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
    savedElements.clone(function (clonedObj) {
      canvas.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
      });
      if (clonedObj.type === 'activeSelection') {
        // active selection needs a reference to the canvas.
        clonedObj.canvas = canvas;
        clonedObj.forEachObject(function (obj) {
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

  applyTransformation(message: socketMessage, canvas: any) {
    let transObj = message.content
    let parsedObj = JSON.parse(transObj);

    if (message.command === Action.PAGEMODIFIED) {
      let keys = Object.keys(parsedObj);
      console.log(JSON.stringify(canvas));

      let receivedCanvas = new fabric.Canvas('canvas');
      receivedCanvas.loadFromJSON(transObj, () => {
        //empty callback needed
      });
      console.log(JSON.stringify(Object.keys(receivedCanvas)))

      //TODO: properly apply canvas changes

      keys.forEach(function(key) {
        // we don't want to set objects completly new
        if(key==='objects') return;

        //JSON represenation doesn't match the actual property value in this case, ingenious...
        if(key==='background') {
          let newKey = 'backgroundColor';
          canvas[newKey] = parsedObj[key];
          console.log(`setting BackroundColour: assigning ${parsedObj[key]} to ${newKey}, old value: ${canvas.backgroundColor}`)
        }else {
        console.log(`assigning ${parsedObj[key]} to ${key}, old value: ${canvas[key]}`)
        canvas[key] = parsedObj[key];
        }
      })
      
    }
    else {
      

      const old = this.getObjectByUUID(parsedObj.uuid, canvas);
    console.log('test: applyTransformation' + ', parsedObj: ' + parsedObj + ', sendMe: ' + parsedObj.sendMe + ', parsedObjuuid: ' + parsedObj.uuid + ', retrievedObj: ' + old + ', JSONmessage:' + JSON.stringify(message));

    console.log('pre enlivenment: ' + JSON.stringify(parsedObj));
    fabric.util.enlivenObjects([parsedObj], function (objects) {
      objects.forEach(function (o) {

        console.log('after enlivenment: ' + JSON.stringify(o));
          o.uuid = parsedObj.uuid;

          if (message.command === Action.ADDED) {
            o.sendMe = false;
            canvas.add(o);
          }
          else if (message.command === Action.MODIFIED) {

            //fallback to add if no such element exists, can be removed and replaced by error message if desired
            if (old === undefined) {
              o.sendMe = false;
              canvas.add(o);
            } else {
              let activeSelection = canvas.getActiveObjects();
              console.log('contains test\nselection: ' + JSON.stringify(activeSelection) + '\nobject: ' + o.uuid);
              console.log('\ncontain result: ' + activeSelection.indexOf(o));
              let keys = Object.keys(o);
              keys.forEach(function (key) {
                //console.log(`assigning ${o[key]} to ${key}, old value: ${old[key]}`)
                old[key] = o[key];
              });
              //this is necessary to reliably render all changes of the object
              old.setCoords();
            }
          }
          else if (message.command === Action.REMOVED) {
            //if no such element exists we are done here
            if (old !== undefined) {
              old.sendMe = false;
              canvas.remove(old);
            }
          }
        
      });

    });
    console.log('after parse.');
  }
  canvas.renderAll();
}


  getObjectByUUID(uuid: string, canvas: any) {
    //this.canvas = this.managePagesService.getCanvas(); //commented as managePageService was removed, needs testing
    return canvas.getObjects().find((o) => o.uuid === uuid);
  }
}
