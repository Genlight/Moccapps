import { Injectable } from '@angular/core';
import { fabric } from 'fabric';

@Injectable({
  providedIn: 'root'
})
export class ManagePagesService {

  private static pageCanvas: any;

  constructor() { }

  // TODO: change page size, possibly to relative values
  static createPage() {
    this.pageCanvas = new fabric.Canvas('canvas',
      {
        backgroundColor: '#ffffff',
      });
    this.pageCanvas.setDimensions({width: '500', heigth: '500'}, {cssOnly: true});
  }

  // TODO: change parameter to page name or number and make pageCanvas an array
  // for now only one page implemented, so only one canvas element to manage
  static getCanvas() {
    return this.pageCanvas;
  }

}
