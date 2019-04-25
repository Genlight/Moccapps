import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { fabric } from './extendedfabric';

@Injectable({
  providedIn: 'root'
})
export class FabricmodifyService {

  constructor() { }

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

  addText(canvas: any, text: string) {
    const label = new fabric.Textbox(text);
    canvas.add(label);
  }

  addCircle(canvas: any) {
    const circle = new fabric.Circle({ radius: 30, fill: 'red', left: 10, right: 10});
    canvas.add(circle);
  }

  addSquare(canvas: any) {
    const square = new fabric.Rect({width: 50, height: 50, fill: 'blue' , left: 10, right: 10});
    canvas.add(square);
  }

  removeElement(canvas: any) {
    if (!canvas.getActiveObject()) {
      return;
    }
    canvas.getActiveObjects().forEach((obj) => {
      canvas.remove(obj);
    });
    canvas.discardActiveObject().renderAll();
  }

  drawingMode(canvas: any) {
    if (canvas.isDrawingMode === false) {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = 10;
    } else {
      canvas.isDrawingMode = false;
    }
  }
}
// /**
//  * @param fabric.object - any Fabric.object like fabric.Circle, fabric.Rect, etc.
//  */
// function appendUUID(obj: fabric.Object): fabric.Object {
//   obj.toObject = (extendUuid(obj))(obj.toObject);
//   obj.uuid = UUID.UUID();
//   return obj;
// }
// function extendUuid(obj) {
//   return function() {
//     return fabric.util.object.extend(this.call('toObject') , {
//       uuid: UUID.UUID()
//     });
//   };
// }
