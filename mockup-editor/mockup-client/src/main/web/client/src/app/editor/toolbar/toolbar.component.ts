import { Component, OnInit } from '@angular/core';
import { faMousePointer, faFont, faLayerGroup, faSitemap, faThLarge, faPaintBrush, faTrash, faObjectGroup, faShapes } from '@fortawesome/free-solid-svg-icons';
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
  faLayerGroup = faSitemap;
  faElements = faShapes;
  faPaintBrush = faPaintBrush;
  faTrash = faTrash;

  drawingModeOn = false;

  constructor(private modifyService: FabricmodifyService, private managePagesService: ManagePagesService) { }

  ngOnInit() {
  }

  onAddText() {
    const canvas = this.managePagesService.getCanvas();
    this.modifyService.addText(canvas, 'Text');
  }

  onAddCircle() {
    const canvas = this.managePagesService.getCanvas();
    this.modifyService.addCircle(canvas);
  }

  onAddSquare() {
    const canvas = this.managePagesService.getCanvas();
    this.modifyService.addSquare(canvas);
  }

  onDrawingMode() {
    const canvas = this.managePagesService.getCanvas();
    this.modifyService.drawingMode(canvas);
    const button = document.getElementById('drawingModeButton');
    button.classList.toggle('btn-dark');
    const settings = document.getElementById('drawingModeSettings');
    settings.classList.toggle('hidden');
    if (this.drawingModeOn === false) {
      this.drawingModeOn = true;
    } else {
      this.drawingModeOn = false;
    }
  }

  onDelete() {
    const canvas = this.managePagesService.getCanvas();
    this.modifyService.removeElement(canvas);
  }

  /* toggles extension panel if elements button is currently toggled,
  otherwise switches the elements button to toggled and the group button to untoggled */ 
  onElementsToggle() {
    const panel = document.getElementById('toolbarextension');
    const groupbutton = document.getElementById('navGroupsButton');
    if (panel.classList.contains('extensionhidden')) {
      panel.classList.toggle('extensionhidden');
    } else if (groupbutton.classList.contains('btn-dark')) {
      groupbutton.classList.toggle('btn-dark');
    } else {
      panel.classList.toggle('extensionhidden');
    }
    const title = document.getElementById('extToolbarTitle');
    title.innerHTML = 'Available Elements';
    const content = document.getElementById('extToolbarContent');
    if (content.classList.contains('extensionhidden')) {
      content.classList.remove('extensionhidden');
    }
    const elementsbutton = document.getElementById('navElementsButton');
    elementsbutton.classList.toggle('btn-dark');
  }

  /* toggles extension panel if group button is currently toggled,
  otherwise switches the group button to toggled and the elements button to untoggled */
  onGroupToggle() {
    const panel = document.getElementById('toolbar-pages');
    const elementsbutton = document.getElementById('navElementsButton');
    if (panel.classList.contains('extensionhidden')) {
      panel.classList.toggle('extensionhidden');
    } else if (elementsbutton.classList.contains('btn-dark')) {
      elementsbutton.classList.toggle('btn-dark');
    } else {
      panel.classList.toggle('extensionhidden');
    }
   /*  const title = document.getElementById('extToolbarTitle');
    title.innerHTML = 'Group Overview';
    const content = document.getElementById('extToolbarContent');
    if (!content.classList.contains('extensionhidden')) {
      content.classList.add('extensionhidden');
    }*/
    const groupbutton = document.getElementById('navGroupsButton');
    groupbutton.classList.toggle('btn-dark'); 
  }

}
