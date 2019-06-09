import { Component, OnInit } from '@angular/core';
import { faEllipsisV, faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faBold, faItalic, faUnderline } from '@fortawesome/free-solid-svg-icons';
import { FabricmodifyService } from '../fabricmodify.service';
import { ManagePagesService } from '../managepages.service';
import { Action } from '../fabric-canvas/transformation.interface';
import { UndoRedoService } from '../../shared/services/undo-redo.service';
import { Page } from 'src/app/shared/models/Page';
import { fabric } from '../extendedfabric';

@Component({
  selector: 'app-customizepanel',
  templateUrl: './customizepanel.component.html',
  styleUrls: ['./customizepanel.component.scss']
})
export class CustomizepanelComponent implements OnInit {

  faEllipsisV = faEllipsisV;
  faAlignCenter = faAlignCenter;
  faAlignLeft = faAlignLeft;
  faAlignRight = faAlignRight;
  faAlignJustify = faAlignJustify;
  faBold = faBold;
  faItalic = faItalic;
  faUnderline = faUnderline;

  private canvas: any;

  /* variables directly acessed in the html need to be public */
  public selected: any;
  public canvasProperties: any = {
    backgroundColor: '#ffffff',
  };
  public elementProperties: any = {
    backgroundColor: '#ffffff',
    fillColor: '#ffffff',
    strokeColor: '#000000',
    strokeWidth: 10,
    backgroundImage: '',
    opacity: 100,
    lockMovement: false,
    lockScale: false,
    lockRotate: false
  };
  public textProperties: any = {
    fontSize: null,
    fontFamily: null,
    fontWeight: null,
    fontStyle: null,
    textAlign: null,
    charSpacing: null,
    lineHeight: null,
    textDecoration: {
      underline: '',
      linethrough: ''
    },
    text: ''
  };
  public drawingMode: any = {
    color: '#000000',
    stroke: 10,
    style: 'pencil',
    shadow: null
  };

  activePage: Page;

  invalidWidthRange: boolean = false;
  invalidHeightRange: boolean = false;

  constructor(
    private modifyService: FabricmodifyService, 
    private undoRedoService: UndoRedoService,
    private managePagesService: ManagePagesService) { 
      this.managePagesService.activePage.subscribe(
        (page) => {
          this.activePage = page;
        }
      );
  }

  ngOnInit() {
    this.setNewPage(this.managePagesService.getCanvas());
  }

  onDimensionChanged() {
    if (this.activePage.width < 0) {
      this.invalidWidthRange = true;
    } else {
      this.invalidWidthRange = false;
    }

    if (this.activePage.height < 0) {
      this.invalidHeightRange = true;
    } else {
      this.invalidHeightRange = false;
    }

    if (this.activePage.width >= 0 && this.activePage.height >= 0 ) {
      this.managePagesService.updateActivePageDimensions(this.activePage.height, this.activePage.width);
    }
  }

  onToggleCustomize() {
    const panel = document.getElementById('customizepanel');
    panel.classList.toggle('showoptions');
  }

  setNewPage(canvas: any) {
    this.canvas = canvas;
    this.canvas.on({
      
      'object:added': (event) => {
        //this.sendMessageToSocket(JSON.stringify(event.transform.target),'added');
      },
      'object:moving': (event) => { },
      'selection:created': (event) => {
        const selectedObject = event.target;
        this.selected = null;
        console.log("selection created: " + JSON.stringify(selectedObject));
        this.manageSelection(selectedObject);
      },
      'selection:updated': (event) => {
        const selectedObject = event.target;
        this.selected = null;
        console.log("selection updated: " + selectedObject);
        this.manageSelection(selectedObject);
      },
      'selection:cleared': (event) => {
        this.selected = null;
      }
    });
  }

  manageSelection(elem) {
    const settings = document.getElementById('multipleElementsSettings');
    if (elem.type === 'activeSelection'|| elem.type == 'group') {
      // load properties of all elements if they are the same and otherwise default or only load default properties generally?
      
    settings.classList.remove('hidden');
    } else {
      settings.classList.add('hidden');
      if (elem.type === 'textbox') {
        this.loadTextProperties(elem);
      } else if (elem.type === 'circle' || elem.type === 'rect') {
      this.loadElementProperties(elem);
      }
    }
    this.selected = elem;
    console.log(this.selected.type);
  }

  loadTextProperties(text) {
    this.loadElementProperties(text);
    this.textProperties.fontSize = text.fontSize;
    this.textProperties.fontFamily = text.fontFamily;
    this.textProperties.fontStyle = (text.fontStyle === 'italic');
    this.textProperties.fontWeight = (text.fontWeight === 'bold');
    this.textProperties.textAlign = text.textAlign;
    this.textProperties.lineHeight = text.lineHeight.toFixed(2);
    this.textProperties.charSpacing = text.charSpacing;
    this.textProperties.textDecoration.underline = text.underline;
    this.textProperties.textDecoration.linethrough = text.linethrough;
    this.textProperties.text = text.text;
    console.log(this.textProperties);
  }

  loadElementProperties(elem) {
    this.elementProperties.backgroundColor = elem.backgroundColor;
    this.elementProperties.fillColor = elem.fill;
    this.elementProperties.opacity = elem.opacity * 100;
    this.elementProperties.strokeWidth = elem.strokeWidth;
    this.elementProperties.strokeColor = elem.stroke;
    this.elementProperties.lockMovement = elem.lockMovementX;
    this.elementProperties.lockScale = elem.lockScalingX;
    this.elementProperties.lockRotate = elem.lockRotation;
    console.log(this.elementProperties);
  }

  setElementProperty(property, value) {
    let currentElem = this.selected;
    console.log('setproperty:current element '+JSON.stringify(currentElem));
    // we need a clone here so we don't actually change the value locally
    // all properties changed this way are sent to the server first and then applied
    // this way inconsistencies can be avoided

    // TODO: disabled for now, as the server doesn't send changes back to the original user yet
    //currentElem=fabric.util.object.clone(currentElem);

    if (currentElem) {
      currentElem.set(property, value);
      this.undoRedoService.save(currentElem,Action.MODIFIED);
    }
    if (currentElem.sendMe) {
      currentElem.sendMe = false; 
      this.managePagesService.sendMessageToSocket(currentElem,Action.MODIFIED);
    }
    currentElem.sendMe = true;
    // TODO: disable once server sends messages also to the origin, will be rendered by applyTransformation
    this.canvas.renderAll();
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

  setCanvasBackgroundColor() {
    this.canvas.setBackgroundColor(this.canvasProperties.backgroundColor);
    
    //sending change
    let _canvas = this.canvas;
    let _pageService = this.managePagesService;

    _canvas.cloneWithoutData((o)=> {
      o.backgroundColor=_canvas.backgroundColor
      _pageService.sendMessageToSocket(o,Action.CANVASMODIFIED);
    });
    this.canvas.renderAll();
  }

  setElementBackgroundColor() {
    this.setElementProperty('backgroundColor', this.elementProperties.backgroundColor);
  }

  setElementFillColor() {
    this.setElementProperty('fill', this.elementProperties.fillColor);
  }

  setElementStrokeColor() {
    this.setElementProperty('stroke', this.elementProperties.strokeColor);
  }

  setElementOpacity() {
    this.setElementProperty('opacity', this.elementProperties.opacity / 100);
  }

  setElementStrokeWidth() {
    this.setElementProperty('strokeWidth', this.elementProperties.strokeWidth);
  }

  setElementMoveLock() { 
    this.setElementProperty('lockMovementX', this.elementProperties.lockMovement);
    this.setElementProperty('lockMovementY', this.elementProperties.lockMovement);
  }

  setElementScaleLock() {
    this.setElementProperty('lockScalingX', this.elementProperties.lockMovement);
    this.setElementProperty('lockScalingY', this.elementProperties.lockMovement);
  }

  setElementRotateLock() {
    this.setElementProperty('lockRotation', this.elementProperties.lockMovement);
  }

  setDrawingModeColor() {
    this.canvas.freeDrawingBrush.color = this.drawingMode.color;
  }

  setDrawingModeStroke() {
    this.canvas.freeDrawingBrush.width = this.drawingMode.stroke;
  }

  setDrawingModeStyle() {
      // TODO
  }

  setFontFamily() {
    this.setElementProperty('fontFamily', this.textProperties.fontFamily);
  }

  setFontSize() {
    this.setElementProperty('fontSize', this.textProperties.fontSize);
  }

  setFontWeight() {
    let fontWeight = '';
    if (this.textProperties.fontWeight) {
      fontWeight = 'bold';
    }
    this.setElementProperty('fontWeight', fontWeight);
  }

  setFontStyle() {
    let fontStyle = '';
    if (this.textProperties.fontStyle) {
      fontStyle = 'italic';
    }
    this.setElementProperty('fontStyle', fontStyle);
  }

  setTextDecoration() {
    this.setElementProperty('underline', this.textProperties.textDecoration.underline);
    this.setElementProperty('linethrough', this.textProperties.textDecoration.linethrough);
    console.log(this.textProperties.textDecoration.underline);
    console.log(this.textProperties.textDecoration.linethrough);
  }

  setText() {
    if (this.textProperties.text === '') {
      this.textProperties.text = 'Text';
    }
    this.setElementProperty('text', this.textProperties.text);
  }

  setTextAlign() {
    this.setElementProperty('textAlign', this.textProperties.textAlign);
  }

  setCharSpacing() {
    this.setElementProperty('charSpacing', this.textProperties.charSpacing);
  }

  setLineHeight() {
    this.setElementProperty('lineHeight', this.textProperties.lineHeight);
  }
}
