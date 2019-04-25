import { Component, OnInit } from '@angular/core';
import { faMousePointer, faFont, faLayerGroup, faThLarge, faPaintBrush, faTrash, faObjectGroup } from '@fortawesome/free-solid-svg-icons';
import { faHandPaper, faSquare, faCircle } from '@fortawesome/free-regular-svg-icons';
import { FabricmodifyService } from '../fabricmodify.service';
import { ManagePagesService } from '../managepages.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  faMousePointer = faMousePointer;
  faHandPointer = faHandPaper;
  faSquare = faSquare;
  faCircle = faCircle;
  faFont = faFont;
  faLayerGroup = faObjectGroup;
  faThLarge = faThLarge;
  faPaintBrush = faPaintBrush;
  faTrash = faTrash;

  drawingModeOn = false;

  constructor(private modifyService: FabricmodifyService) { }

  ngOnInit() {
  }

  onAddText() {
    const canvas = ManagePagesService.getCanvas();
    this.modifyService.addText(canvas, 'Text');
  }

  onAddCircle() {
    const canvas = ManagePagesService.getCanvas();
    this.modifyService.addCircle(canvas);
  }

  onAddSquare() {
    const canvas = ManagePagesService.getCanvas();
    this.modifyService.addSquare(canvas);
  }

  onDrawingMode() {
    const canvas = ManagePagesService.getCanvas();
    this.modifyService.drawingMode(canvas);
    const button = document.getElementById('drawingModeButton');
    button.classList.toggle('btn-dark');
    if (this.drawingModeOn === false) {
      this.drawingModeOn = true;
    } else {
      this.drawingModeOn = false;
    }
  }

  onDelete() {
    const canvas = ManagePagesService.getCanvas();
    this.modifyService.removeElement(canvas);
  }

}
