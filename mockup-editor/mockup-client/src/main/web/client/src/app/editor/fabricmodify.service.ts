import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { fabric } from './extendedfabric';
import { Group } from 'fabric';
import { ManageGroupsService } from './managegroups.service';
import { Action } from './fabric-canvas/transformation.interface';
import { ManagePagesService } from "./managepages.service";
import { socketMessage } from '../socketConnection/socketMessage';
import { UUID } from 'angular2-uuid';
let savedElements = null;

@Injectable({
  providedIn: 'root'
})

export class FabricmodifyService {
  canvas: any;
  private foreignSelections:Map<string,[any]>;
  private canvasHelpBegin: string = "{\"version\":\"2.7.0\",\"objects\":[";
  private canvasHelpEnd:string = "]}";  
  private helpCanvas = new fabric.Canvas('helper', {
    height:3000,
    width:3000
  });

  constructor(private groupService: ManageGroupsService) {
    this.newForeignSelections();
  }

  clearAll(canvas: any) {
    canvas.clear();
    this.setBackgroundColor(canvas, "white");
  }

  loadFromJSON(canvas: any, json: string) {
    //console.log(`loadFromJSON: object count: ${((canvas || {}).objects || {}).length}`);
    canvas.loadFromJSON(JSON.parse(json), () => {
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

  /* clears selection in canvas */
  clearSelection(canvas: any) {
    canvas.discardActiveObject();
    canvas.renderAll();
  }

  /* groups active elements in given canvas if more than one element is selected */
  group(canvas: any) {
    if (!canvas.getActiveObject()) {
      return;
    }
    if (canvas.getActiveObject().type !== 'activeSelection') {
      return;
    }
    let temp = canvas.getActiveObject().toGroup();
    canvas.discardActiveObject();
    temp.statefullCache = true;
    canvas.setActiveObject(temp);
    //temp.set('dirty', true);
    temp = (temp as Group);
    this.groupService.add(temp);
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
    //activeGrp.toActiveSelection();
    let objects = activeGrp.getObjects();
    canvas.remove(activeGrp);
    activeGrp.destroy();
    objects.forEach((o)=> {
      o.sendMe = true;
      canvas.add(o);
    });    
    var newSelection = new fabric.ActiveSelection(objects, {canvas:canvas});
    canvas.setActiveObject(newSelection);
    
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
      const _this = this;
      savedElements.clone(function (clonedObj) {
        canvas.discardActiveObject();
        clonedObj.set({
          left: clonedObj.left + 10,
          top: clonedObj.top + 10,
          evented: true,
          uuid: UUID.UUID()
        });
        if (clonedObj.type === 'activeSelection') {
          // active selection needs a reference to the canvas.
          clonedObj.canvas = canvas;
          clonedObj.forEachObject(function(obj) {
            if (obj.type === 'group') {
              _this.changeUUIDs(obj);
            } else {
              obj.uuid = UUID.UUID();
            }
            FabricmodifyService.calcExtractFromGroup(obj,clonedObj);
            canvas.add(obj);
            FabricmodifyService.calcInsertIntoGroup(obj,clonedObj);
          });
          // this should solve the unselectability
          clonedObj.setCoords();
        } else {
          if (clonedObj.type === 'group') {
            _this.changeUUIDs(clonedObj);
            clonedObj.setCoords();
          }
          canvas.add(clonedObj);
        }
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
      });
    }
  
    /**
     * changes uuid of groups in groups to be able to copy them
     * @param elem element to change uuid of
     */
    changeUUIDs(elem: any) {
      const _this = this;
      if (elem.type === 'group') {
        elem.forEachObject((o) => {
          _this.changeUUIDs(o);
          o.setCoords();
        });
      }
      elem.uuid = UUID.UUID();
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

  loadImageFromURL(canvas: any, url: any) {
    if (url.includes('.svg') === true) {
      fabric.loadSVGFromURL(url, function (objects, options) {
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
        canvas.add(image);
      });
    }
    canvas.renderAll();
  }

  applyTransformation(message: socketMessage, canvas: any) {
    let transObj = message.content
    let parsedObj = JSON.parse(transObj);

    if (message.command === Action.PAGEMODIFIED) {
      let keys = Object.keys(parsedObj);
      //console.log(JSON.stringify(canvas));

      //let receivedCanvas = new fabric.Canvas('canvas');
      //receivedCanvas.loadFromJSON(transObj, () => {
      //empty callback needed
      //});
      //console.log(JSON.stringify(Object.keys(receivedCanvas)))
      let _this = this;

      keys.forEach(function (key) {
        // we don't want to set objects completly new
        if (key === 'objects') return;

        else if (key === 'index') {

          let index = parsedObj.index
          //we need to flip the order if we bring objects to front, so we will bring the topmost object to front first.
          let orderedObjects = index < 0 ? parsedObj.objects : parsedObj.objects.reverse();
          //console.log('canvas before orderchange:'+JSON.stringify(canvas));
          orderedObjects.forEach(function (current) {
            let old = _this.getObjectByUUID(current.uuid, canvas.getObjects());
            switch (index) {
              case 1:
                //canvas.bringForward(_this.getObjectByUUID(current.uuid, canvas.getObjects()));
                old.bringForward();
                break;
              case 2:
                //canvas.bringToFront(_this.getObjectByUUID(current.uuid, canvas.getObjects()));
                old.bringToFront();
                break;
              case -1:
                //canvas.sendBackwards(_this.getObjectByUUID(current.uuid, canvas.getObjects()));
                old.sendBackwards();
                break;
              case -2:
                //canvas.sendToBack(_this.getObjectByUUID(current.uuid, canvas.getObjects()));
                old.sendToBack();
                break;
            }
          });
          //console.log('canvas after orderchange:'+JSON.stringify(canvas));
        }

        //JSON represenation doesn't match the actual property value in this case, ingenious...
        /*else if (key === 'backgroundColor') {
          let newKey = 'backgroundColor';
          canvas[newKey] = parsedObj[key];
          console.log(`setting BackroundColour: assigning ${parsedObj[key]} to ${newKey}, old value: ${canvas.backgroundColor}`)
        }*/ else {
          //console.log(`assigning ${parsedObj[key]} to ${key}, old value: ${canvas[key]}`)
          canvas[key] = parsedObj[key];
        }
      })

    } else {
      const old = this.getObjectByUUID(parsedObj.uuid, canvas.getObjects());

      if (message.command === Action.ADDED) {
        //old exists if I created the object myself. clean solution: make add button send change but not add in the first place
        //for 99.9% of the cases, this will suffice (0.1%: in case of uuid collision this becomes inconsistent)
        if (!old) {
          this.addRemoteObject(parsedObj, canvas);
        }
      }
      else if (message.command === Action.LOCK) {

        if(old) {
          old['evented'] = false;
          old['selectable'] = false;
        }
      }
      else if(message.command === Action.UNLOCK) {
        
        if(old) {
          old['evented'] = true;
          old['selectable'] = true;
        }
      }   
      else if(message.command === Action.SELECTIONMODIFIED) {
        if(!old) {
          this.foreignSelections.set(parsedObj.userId,[null])
        } else {
          this.foreignSelections.get(parsedObj.userId).push(old);
        }
      }
      else if (message.command === Action.MODIFIED) {

        //fallback to add if no such element exists, can be removed and replaced by error message if desired
        if (old === undefined) {
          this.addRemoteObject(parsedObj, canvas);
        } else {
          let _this = this;
          fabric.util.enlivenObjects([parsedObj], function (objects) {
            let furtureSelection = [];
            objects.forEach(function (aliveObject) {

              let selectionChange: boolean = false;
              let activeSelection = canvas.getActiveObject();
              let positionInCurrentSelection: number;
              if (activeSelection && activeSelection.type === 'activeSelection') {
                let activeSelectionObjects = canvas.getActiveObjects();

                //console.log('contains test\nselection: ' + JSON.stringify(activeSelectionObjects) + '\nobject: ' + parsedObj.uuid);
                //console.log('\ncontain result: ' + activeSelectionObjects.indexOf(old));
                positionInCurrentSelection = activeSelectionObjects.indexOf(old);

                if (positionInCurrentSelection !== -1) {

                  selectionChange = true;
                  FabricmodifyService.calcExtractFromGroup(old, activeSelection);

                }
              }

              let keys = Object.keys(aliveObject);

              if(old.type === 'group') {
                /*keys = Object.keys(old);
                keys.forEach((key) => {
                  if(aliveObject[key] !== undefined) {
                    old.set(key,aliveObject[key]);
                  }
                })*/
                let groupExport = _this.canvasHelpBegin+transObj+_this.canvasHelpEnd;
                _this.helpCanvas.loadFromJSON(groupExport);
                let newGroup = _this.getObjectByUUID(old.uuid,_this.helpCanvas.getObjects());
                let index = _this.getObjectIndex(old,canvas);
                //old.sendMe = false;
                //newGroup.sendMe = false;

                newGroup.canvas = canvas;
                newGroup.sendMe = true;
                canvas._objects[index] = newGroup;
                let editForeignSelections = _this.foreignSelections.get(message.user);
                if(editForeignSelections&&editForeignSelections.length>1) {
                  for(let i = 1;i<editForeignSelections.length;i++) {
                    if(newGroup.uuid === editForeignSelections[i].uuid) {
                      editForeignSelections[i] = newGroup;
                      _this.foreignSelections.set(message.user, editForeignSelections);
                      break;
                    }
                  }
                }
                if(selectionChange) {
                  let selectedObj = activeSelection.getObjects();
                  for(let i = 0;i<selectedObj.length;i++) {
                    if(newGroup.uuid === selectedObj[i].uuid) {
                      activeSelection._objects[i] = newGroup;
                      break;
                    }
                  }
                } 
                /*keys = Object.keys(newGroup);
                keys.forEach((key) => {
                  old[key] = newGroup[key];
                })*/
                //if(positionInCurrentSelection!==-1) activeSelection.removeWithUpdate(old);

                /*
                canvas.remove(old);
                canvas.insertAt(newGroup,index);
                */

                //if(positionInCurrentSelection!==-1) {
                  //FabricmodifyService.calcInsertIntoGroup(newGroup,activeSelection);
                  //activeSelection.addWithUpdate(newGroup);
                //}
              } else {
              keys.forEach(function (key) {
                //console.log(`assigning ${o[key]} to ${key}, old value: ${old[key]}`)
                old.set(key, aliveObject[key]);
              });
            }
              old.sendMe = true;
              if (selectionChange) {
                FabricmodifyService.calcInsertIntoGroup(old, activeSelection);
              }

              //this is necessary to reliably render all changes of the object
              old.setCoords();
            })
          })

        }
      }
      else if (message.command === Action.REMOVED) {
        //if no such element exists we are done here
        if (old !== undefined) {
          old.sendMe = false;
          canvas.remove(old);
        }
      }
      //console.log('after parse (applyTransformation).');
    }
    canvas.renderAll();
  }

/**
 * Checks an array if it contains a certain fabric object with the given uuid.
 * Also traverses groups inside the array, therefore iterating through all the objects.
 * Traverses 1 level at a time, and only then steps into a group, as most hits will be at the top level.
 * Traverses from end to begin of the array, as elements at the begin are rendered in front,
 * and are therefore more likely to be edited (and therefore searched for).
 * Supposed to be called initally with canvas.getObjects().
 * 
 * @param uuid the uuid of the object to be found
 * @param array the array to search in
 * @returns the object if found, undefined otherwise
 */
  getObjectByUUID(uuid: string, array: Array<any>) {
    
    let grouptsToTraverse = [];
    for(let i = array.length-1;i>=0;--i ) {
      let current = array[i];
      if(current.uuid === uuid) {
        return current;
      }
      if(current.type === 'group') {
        grouptsToTraverse.push(current);
      }
    }
    for(let i = grouptsToTraverse.length-1; i>=0;--i) {
      let current = grouptsToTraverse[i];
      //current.set('dirty',true);
      let result = this.getObjectByUUID(uuid,current.getObjects());
      if (result) return result;
    }
  }

  getForeignSelections(): Map<string, [any]> {
    return this.foreignSelections;
  }

  newForeignSelections() {
    this.foreignSelections = new Map<string, [any]>();
  }
  /**
   * This method modifies the values of an object in a way that they are again relative to the
   * canvas and not the provided group. Counterpart of calcInsertIntoGroup. Does not remove the object
   * from the group
   * @param obj the object to modify
   * @param group the group the object comes from
   */
  static calcExtractFromGroup(obj, group) {
    //console.log('pre extract obj mod: ' +JSON.stringify(obj));
    let groupHeightMiddle: number = group.height / 2.0;
    let groupWidthMiddle: number = group.width / 2.0;
    let groupLeft: number = group.left;
    let groupTop: number = group.top;

    obj.left = groupLeft + (groupWidthMiddle + obj.left);
    obj.top = groupTop + (groupHeightMiddle + obj.top);

    //console.log('post extract obj mod: ' +JSON.stringify(obj));
  }

  /**
   * This method modifies the values of an object in a way that they are relative to the
   * provided group. Counterpart of extractFromGroup. Does not add the object to the group.
   * @param obj the object to modify
   * @param group the group to insert to
   */
  static calcInsertIntoGroup(obj, group) {

    //console.log('pre insert obj mod: ' +JSON.stringify(obj));
    let groupHeightMiddle: number = group.height / 2.0;
    let groupWidthMiddle: number = group.width / 2.0;
    let groupLeft: number = group.left;
    let groupTop: number = group.top;
    obj.left = obj.left - (groupLeft + groupWidthMiddle);
    obj.top = obj.top - (groupTop + groupHeightMiddle);

    //console.log('post insert mod: ' +JSON.stringify(obj));
  }

  /**
   * This method transform a received JSON object and adds it to the canvas
   * @param obj the object to add
   * @param canvas the canvas to add on
   */
  private addRemoteObject(obj, canvas) {
    fabric.util.enlivenObjects([obj], function (objects) {
      objects.forEach(function (o) {
        o.uuid = obj.uuid;
        canvas.add(o);
      });
    });
  }

  private getObjectIndex(obj, canvas) {
    let objects = canvas.getObjects();
    for(let i = 0;i<objects.length; i++) {
      let current = objects[i];
      if(obj.uuid === current.uuid) return i;
    }
  }
}