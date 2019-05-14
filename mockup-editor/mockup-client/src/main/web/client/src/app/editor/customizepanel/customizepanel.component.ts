import { Component, OnInit } from '@angular/core';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FabricmodifyService } from '../fabricmodify.service';
import { ManagePagesService } from '../managepages.service';

@Component({
  selector: 'app-customizepanel',
  templateUrl: './customizepanel.component.html',
  styleUrls: ['./customizepanel.component.scss']
})
export class CustomizepanelComponent implements OnInit {

  faEllipsisV = faEllipsisV;

  private canvas: any;
  private selected: any;
  private elementProperties: any = {
    backgroundColor: '#ffffff',
    backgroundImage: '',
    id: null,
    opacity: 100,
    fill: null,
    fontSize: null,
    lineHeight: null,
    charSpacing: null,
    fontWeight: null,
    fontStyle: null,
    textAlign: null,
    fontFamily: null,
    TextDecoration: ''
  };

  private drawingMode: any = {
    color: '#000000',
    stroke: 10,
    style: null,
    shadow: null
  };

  constructor(private modifyService: FabricmodifyService, private managePagesService: ManagePagesService) { }

  ngOnInit() {
    this.setNewPage(this.managePagesService.getCanvas());
  }

  onToggleCustomize() {
    const panel = document.getElementById('customizepanel');
    panel.classList.toggle('showoptions');
  }

  setNewPage(canvas: any) {
    this.canvas = canvas;
    this.canvas.on({
      'object:moving': (event) => { },
      'object:modified': (event) => { },
      'object:selected': (event) => {
        const selectedObject = event.target;
        if (this.selected) {
          //TODO select more than one
          this.selected.concat(selectedObject);
        } else {
          this.selected = selectedObject;
        }
        console.log(this.selected.type);
      },
      'selection:cleared': (event) => {
          this.selected = null;
        }
      });
      //TODO manage mouse selection area
  }

  bringToFront() {
    this.modifyService.bringToFront(this.canvas);
  }

  bringForward() {
    this.modifyService.bringForward(this.canvas);
  }

  sendToBack() {
    this.modifyService.sendToBack(this.canvas);
  }

  sendBackwards() {
    this.modifyService.sendBackwards(this.canvas);
  }

  setBackgroundColor() {
    console.log('color is ' + this.elementProperties.backgroundColor);
    if (this.selected) {
      //TODO manage group selections - possible to set background color - yes/no?
      //this.selected.forEach((obj) => {
      //  obj.set('fill', this.elementProperties.backgroundColor);
      //});
      this.selected.set('fill', this.elementProperties.backgroundColor);
    } else {
      this.canvas.setBackgroundColor(this.elementProperties.backgroundColor);
    }
    this.canvas.renderAll();
  }

  setElementOpacity() {
    if (this.selected) {
      this.selected.set('opacity', this.elementProperties.opacity / 100);
    }
    this.canvas.renderAll();
  }

  setDrawingModeColor() {
    this.canvas.freeDrawingBrush.color = this.drawingMode.color;
  }

  setDrawingModeStroke() {
    this.canvas.freeDrawingBrush.width = this.drawingMode.stroke;
  }

  setDrawingModeStyle() {

  }

}
