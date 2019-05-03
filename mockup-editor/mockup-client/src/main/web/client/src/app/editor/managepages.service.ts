import { Injectable } from '@angular/core';
import { fabric } from './extendedfabric';

@Injectable({
  providedIn: 'root'
})
export class ManagePagesService {

  private pageCanvas: any;

  constructor() { }

  // TODO: change page size, possibly to relative values
  createPage( pagewidth: number, pageheight: number) {
    this.pageCanvas = new fabric.Canvas('canvas',
      {
        backgroundColor: '#ffffff',
        preserveObjectStacking: true,
        width: pagewidth,
        height: pageheight,
        cssOnly: true
      });
  // relative values can be used with setDimensions function of fabric.js
  // this.pageCanvas.setDimensions({width: '1000px', heigth: '1000px'}, {cssOnly: true});
  }

  // TODO: change parameter to page name or number and make pageCanvas an array
  // for now only one page implemented, so only one canvas element to manage
  getCanvas() {
    return this.pageCanvas;
  }

}
