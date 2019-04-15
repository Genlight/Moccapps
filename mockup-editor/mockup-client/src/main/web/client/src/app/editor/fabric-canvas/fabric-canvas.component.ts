import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-fabric-canvas',
  templateUrl: './fabric-canvas.component.html',
  styleUrls: ['./fabric-canvas.component.scss']
})
export class FabricCanvasComponent implements OnInit {

  // Fabric canvas. Note: this is not html canvas.
  // http://fabricjs.com/
  private canvas: any;

  constructor() { }

  ngOnInit() {
    this.canvas = new fabric.Canvas('canvas',
      {
        backgroundColor: '#ffffff'
      });
    this.setCanvasSize(400, 400);
  }

  setCanvasSize(width, height) {
    // TODO: validate input.
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
  }

  addText(text: string) {
    const label = new fabric.Textbox(text);
    this.canvas.add(label);
  }

  onAddText() {
    this.addText('Text');
  }

  onRemove() {
    const actObj = this.canvas.getActiveObject();
    this.canvas.remove(actObj);
  }

  onGroup() {
    this.group();
  }

  onUngroup() {
    this.ungroup();
  }

  ungroup() {
    if (!this.canvas.getActiveObject()) {
      return;
    }
    if (this.canvas.getActiveObject().type !== 'group') {
      return;
    }
    this.canvas.getActiveObject().toActiveSelection();
    this.canvas.requestRenderAll();
  }

  group() {
    if (!this.canvas.getActiveObject()) {
      return;
    }
    if (this.canvas.getActiveObject().type !== 'activeSelection') {
      return;
    }
    this.canvas.getActiveObject().toGroup();
    this.canvas.requestRenderAll();
  }

}
