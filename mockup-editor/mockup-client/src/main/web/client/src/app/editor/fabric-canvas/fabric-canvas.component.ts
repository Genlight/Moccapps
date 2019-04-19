import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';
import { FabricmodifyService } from '../fabricmodify.service';
import { ManagePagesService } from '../managepages.service';

@Component({
  selector: 'app-fabric-canvas',
  templateUrl: './fabric-canvas.component.html',
  styleUrls: ['./fabric-canvas.component.scss']
})

export class FabricCanvasComponent implements OnInit {

  // Fabric canvas. Note: this is not html canvas.
  // http://fabricjs.com/
  private canvas: any;

  constructor(private modifyService: FabricmodifyService) { }

  // TODO: manage canvas for different pages and not just one
  ngOnInit() {
    ManagePagesService.createPage();
    this.canvas = ManagePagesService.getCanvas();
  }

  addText(text: string) {
    const label = new fabric.Textbox(text);
    this.canvas.add(label);
  }

  onAddText() {
    this.modifyService.addText(this.canvas, 'Text');
  }

  onRemove() {
    this.modifyService.removeElement(this.canvas);
  }

  onGroup() {
    this.modifyService.group(this.canvas);
  }

  onUngroup() {
    this.modifyService.ungroup(this.canvas);
  }

}
