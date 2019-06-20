import { Component, OnInit } from '@angular/core';
import { faEllipsisV, faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faBold, faItalic, faUnderline } from '@fortawesome/free-solid-svg-icons';
import { FabricmodifyService } from '../fabricmodify.service';
import { ManagePagesService } from '../managepages.service';
import { Action, CanvasTransmissionProperty } from '../fabric-canvas/transformation.interface';
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
  //this is used for the transmission of canvas height and width, as those do not easily survive transmission in the regular way
  private DEFAULT_CANVAS: string = "{\"version\":\"2.7.0\",\"objects\":[]}";

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
        //this.onPageChanged();
      }
    );
    this.managePagesService.isLoadingPage.subscribe(
      (value) => {
        if (!value) {
          this.onPageChanged();
        }
      }
    )
  }

  ngOnInit() {
    this.setNewPage(this.managePagesService.getCanvas());
  }

  /**
   * Do initialization after page change
   */
  onPageChanged() {
    if (!!this.canvas) {
      // Update backgroundcolor
      const backgroundColor = this.canvas.backgroundColor;
      //alert(backgroundColor);
      this.managePagesService.getGridCanvas().backgroundColor = backgroundColor;
      this.canvasProperties.backgroundColor = backgroundColor;
    }
    //this.setCanvasBackgroundColor();
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

    if (this.activePage.width >= 0 && this.activePage.height >= 0) {
      this.managePagesService.updateActivePageDimensions(this.activePage.height, this.activePage.width);

      let defaultCanvas = JSON.parse(this.DEFAULT_CANVAS);
      defaultCanvas[CanvasTransmissionProperty.CHANGEHEIGHT] = this.activePage.height;
      defaultCanvas[CanvasTransmissionProperty.CHANGEWIDTH] = this.activePage.width;

      //TODO: the send works fine but the application of the change is broken due to REST persisting
      this.managePagesService.sendMessageToSocket(defaultCanvas, Action.PAGEDIMENSIONCHANGE);
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
    if (elem.type === 'activeSelection' || elem.type === 'group') {
      // load properties of all elements if they are the same and otherwise default or only load default properties generally?

    } else {
      if (elem.type === 'textbox') {
        this.loadTextProperties(elem);
      } else if (elem.type === 'circle' || elem.type === 'rect') {
        this.loadElementProperties(elem);
      }
    }
    this.selected = elem;
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
    console.log('setproperty:current element ' + JSON.stringify(currentElem));
    // we need a clone here so we don't actually change the value locally
    // all properties changed this way are sent to the server first and then applied
    // this way inconsistencies can be avoided

    // TODO: disabled for now, as the server doesn't send changes back to the original user yet
    //currentElem=fabric.util.object.clone(currentElem);

    if (currentElem) {
      currentElem.set(property, value);
      this.undoRedoService.save(currentElem, Action.MODIFIED);
    }
    if (currentElem.sendMe) {
      currentElem.sendMe = false;
      this.managePagesService.sendMessageToSocket(currentElem, Action.MODIFIED);
    }
    currentElem.sendMe = true;
    // TODO: disable once server sends messages also to the origin, will be rendered by applyTransformation
    this.canvas.renderAll();
  }

  bringToFront() {
    //this.modifyService.bringToFront(this.canvas);
    this.sendCloneAddVirtualIndex(this.canvas.getActiveObject(),2);
  }

  bringForward() {
    //this.modifyService.bringForward(this.canvas);
    this.sendCloneAddVirtualIndex(this.canvas.getActiveObject(),1);
  }

  sendToBack() {
    //this.modifyService.sendToBack(this.canvas);
    this.sendCloneAddVirtualIndex(this.canvas.getActiveObject(),-2);
  }

  sendBackwards() {
    //this.modifyService.sendBackwards(this.canvas);
    this.sendCloneAddVirtualIndex(this.canvas.getActiveObject(),-1);
  }

  private sendCloneAddVirtualIndex(obj, index: number) {
    let toSend = [];
    if (obj.type === 'activeSelection') {
      /*obj.getObjects().forEach(function (current) {
        current.clone((o) => {
          o['index'] = index;
          toSend.push(o);
        })
      });*/
      toSend = obj.getObjects();

    } else {
      toSend = [obj];
      /*obj.clone((o) => {
        o['index'] = index;
        toSend.push(o);
      })*/
    }
    let changeObject = {'objects':toSend, 'index':index};
    this.sendCanvas(changeObject,Action.PAGEMODIFIED);

  }

  setCanvasBackgroundColor() {
    //sending change
    //let test = CanvasTransmissionProperty.BACKGROUNDCOLOR
    let changeObject = { [CanvasTransmissionProperty.BACKGROUNDCOLOR]: this.canvasProperties.backgroundColor };
    this.sendCanvas(changeObject, Action.PAGEMODIFIED);

    this.managePagesService.getGridCanvas().backgroundColor = this.canvasProperties.backgroundColor;
    this.managePagesService.getGridCanvas().renderAll();
    if (this.canvas.backgroundColor !== null) {
      this.canvas.setBackgroundColor(this.canvasProperties.backgroundColor);
      this.canvas.renderAll();
    }
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
    this.setElementProperty('lockScalingX', this.elementProperties.lockScale);
    this.setElementProperty('lockScalingY', this.elementProperties.lockScale);
  }

  setElementRotateLock() {
    this.setElementProperty('lockRotation', this.elementProperties.lockRotate);
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

  /**
   * creates an empty canvas and appends any property contained in the parameter that should be transmitted, and therefore changed
   * @param propertyObject this object contains all the properties that should be set on the empty canvas
   */
  private sendCanvas(propertyObject: Object, action: Action) {
    let _canvas = this.canvas;
    let _pageService = this.managePagesService;
    let sendCanvas = JSON.parse(this.DEFAULT_CANVAS);
    //_canvas.cloneWithoutData((o) => {
      let keys = Object.keys(propertyObject);
      keys.forEach(function (key) {
        sendCanvas[key] = propertyObject[key]
        console.log('assigning ' + JSON.stringify(propertyObject[key]) + ' to ' + key);
      });
      console.log('canvasToSend: ' + JSON.stringify(sendCanvas))
      _pageService.sendMessageToSocket(sendCanvas, action);
    //});
  }
}
