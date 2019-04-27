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

  /* toggles extension panel if page button is currently toggled,
  otherwise switches the page button to toggled and the group button to untoggled */ 
  onPageToggle() {
    const panel = document.getElementById('toolbarextension');
    const groupbutton = document.getElementById('navGroupsButton');
    if (panel.classList.contains('extensionhidden')) {
      panel.classList.toggle('extensionhidden');
    } else if (groupbutton.classList.contains('btn-dark')) {
      groupbutton.classList.toggle('btn-dark');
    } else {
      panel.classList.toggle('extensionhidden');
    }
    const pagebutton = document.getElementById('navPagesButton');
    pagebutton.classList.toggle('btn-dark');
  }

  /* toggles extension panel if group button is currently toggled,
  otherwise switches the group button to toggled and the page button to untoggled */
  onGroupToggle() {
    const panel = document.getElementById('toolbarextension');
    const pagebutton = document.getElementById('navPagesButton');
    if (panel.classList.contains('extensionhidden')) {
      panel.classList.toggle('extensionhidden');
    } else if (pagebutton.classList.contains('btn-dark')) {
      pagebutton.classList.toggle('btn-dark');
    } else {
      panel.classList.toggle('extensionhidden');
    }
    const groupbutton = document.getElementById('navGroupsButton');
    groupbutton.classList.toggle('btn-dark');
  }

}
