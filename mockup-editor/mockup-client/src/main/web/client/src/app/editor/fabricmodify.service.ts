import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { UUID } from 'angular2-uuid';
import { Observable, of } from 'rxjs';

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
    if (!canvas.getActiveObject()) {
      return;
    }
    if (canvas.getActiveObject().type !== 'group') {
      return;
    }
    canvas.getActiveObject().toActiveSelection();
    canvas.requestRenderAll();
  }

  addText(canvas: any, text: string) {
    const label = new fabric.Textbox(text);
    canvas.add(appendUUID(label));
  }

  addCircle(canvas: any) {
    const circle = new fabric.Circle({ radius: 30, fill: 'red', left: 10, right: 10});
    canvas.add(appendUUID(circle));
  }

  addSquare(canvas: any) {
    const square = new fabric.Rect({width: 50, height: 50, fill: 'blue' , left: 10, right: 10});
    canvas.add(appendUUID(square));
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
/**
 * @param fabric.object - any Fabric.object like fabric.Circle, fabric.Rect, etc.
 */
function appendUUID(obj: fabric.Object): fabric.Object {
  obj.toObject = extendUuid(obj)(obj.toObject);
  obj.uuid = UUID.UUID();
  return obj;
}
function extendUuid(obj) {
  return function() {
    return fabric.util.object.extend(obj.callSuper('toObject') , {
      uuid: UUID.UUID()
    });
  };
}
