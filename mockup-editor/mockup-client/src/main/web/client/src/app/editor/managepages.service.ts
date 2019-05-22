import { Injectable } from '@angular/core';
import { fabric } from './extendedfabric';
import { Page } from '../shared/models/Page';

@Injectable({
  providedIn: 'root'
})
export class ManagePagesService {

  private pageCanvas: any;
  private pages: Page[];

  constructor() { }

  loadPages() {

  }

  // TODO: change page size, possibly to relative values
  createPage( pagewidth: number, pageheight: number) {
    let page = new Page();
    page.canvas = new fabric.Canvas('canvas',
    {
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      width: pagewidth,
      height: pageheight,
      cssOnly: true
    });
    page.height = pageheight;
    page.width = pagewidth;

    this.pageCanvas = page.canvas;
    
    this.pages.push(page);
  // relative values can be used with setDimensions function of fabric.js
  // this.pageCanvas.setDimensions({width: '1000px', heigth: '1000px'}, {cssOnly: true});
  }

  removePage(page: Page) {
    if (!!page) {
      
    }
  }

  // TODO: change parameter to page name or number and make pageCanvas an array
  // for now only one page implemented, so only one canvas element to manage
  getCanvas() {
    return this.pageCanvas;
  }

}
