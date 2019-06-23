import { Component, OnInit } from '@angular/core';
import { faEllipsisV, faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faBold, faItalic, faUnderline } from '@fortawesome/free-solid-svg-icons';
import { FabricmodifyService } from '../fabricmodify.service';
import { ManagePagesService } from '../managepages.service';
import { Action, CanvasTransmissionProperty } from '../fabric-canvas/transformation.interface';
import { UndoRedoService } from '../../shared/services/undo-redo.service';
import { Page } from 'src/app/shared/models/Page';
import { fabric } from '../extendedfabric';
import { WorkspaceService } from '../workspace.service';

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
  public groupProperties: any = {
    fillColor: '#ffffff',
    strokeColor: '#ffffff',
    strokeWidth: 10,
    opacity: 100,
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

  isGridEnabled: boolean = false;

  constructor(
    private modifyService: FabricmodifyService,
    private undoRedoService: UndoRedoService,
    private managePagesService: ManagePagesService,
    private workspaceService: WorkspaceService) {
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
    );
    this.workspaceService.showsGrid.subscribe((value) => {
      this.isGridEnabled = value;
    });
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
      if (!this.isGridEnabled) {
        this.canvas.backgroundColor = backgroundColor;
        this.canvas.renderAll();
      } else {
        this.canvas.backgroundColor = null;
        this.canvas.renderAll();
      }  
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
      if (this.activePage.height >= 3000) {
        this.activePage.height = 3000;
      }
      if (this.activePage.width >= 3000) {
        this.activePage.height = 3000;
      }
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
        //console.log('object added..........');
        //console.log(event.target);
      },
      'object:moving': (event) => { },
      'selection:created': (event) => {
        const selectedObject = event.target;
        this.selected = null;
        //console.log("selection created: " + JSON.stringify(selectedObject));
        this.manageSelection(selectedObject);
      },
      'selection:updated': (event) => {
        const selectedObject = event.target;
        this.selected = null;
        //console.log("selection updated: " + selectedObject);
        this.manageSelection(selectedObject);
      },
      'selection:cleared': (event) => {
        this.selected = null;
      }
    });
  }

  /**
   * loads elment properties based on elment type
   * @param elem selected elment(s)
   */
  manageSelection(elem) {
    if (elem.type === 'activeSelection' || elem.type === 'group') {
      // load properties of all elements if they are the same and otherwise default or only load default properties generally?
      this.loadGroupProperties(elem);
    } else if (elem.type === 'textbox') {
        this.loadTextProperties(elem);
      } else if (elem.type === 'image') {
        // probably add filters here
      } else { //if (elem.type === 'circle' || elem.type === 'rect') {
        this.loadElementProperties(elem);
      }
    this.selected = elem;
  }

  /**
   * copies properties of a group of elments to a variable
   * @param group element group to copy properties from
   */
  loadGroupProperties(group) {
    group.forEachObject( (elem) => {
      const fill = elem.fill;
      const strokeColor = elem.stroke;
      const strokeWidth = elem.strokeWidth;
      const opacity = elem.opacity * 100;
      if (this.groupProperties.fillColor !== fill) {
        this.groupProperties.strokeColor = '#ffffff';
      }
      if (this.groupProperties.strokeColor !== strokeColor) {
        this.groupProperties.strokeColor = '#ffffff';
      }
      if (this.groupProperties.strokeWidth !== strokeWidth) {
        this.groupProperties.strokeColor = 0;
      }
      if (this.groupProperties.opacity !== opacity) {
        this.groupProperties.opacity = 100;
      }
    });
    
  }

  /**
   * copies properties of a text elment to a variable
   * @param text text element to copy properties from
   */
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
    //console.log(this.textProperties);
  }

  /**
   * copies properties of an elment to a variable
   * @param elem element to copy properties from
   */
  loadElementProperties(elem) {
    this.elementProperties.backgroundColor = elem.backgroundColor;
    this.elementProperties.fillColor = elem.fill;
    this.elementProperties.opacity = elem.opacity * 100;
    this.elementProperties.strokeWidth = elem.strokeWidth;
    this.elementProperties.strokeColor = elem.stroke;
    this.elementProperties.lockMovement = elem.lockMovementX;
    this.elementProperties.lockScale = elem.lockScalingX;
    this.elementProperties.lockRotate = elem.lockRotation;
    //console.log(this.elementProperties);
  }

  /**
   * set a property for a single object
   * @param property property to set
   * @param value new value of the property
   */
  setElementProperty(property, value) {
    let currentElem = this.selected;
    //console.log('setproperty:current element ' + JSON.stringify(currentElem));
    // we need a clone here so we don't actually change the value locally
    // all properties changed this way are sent to the server first and then applied
    // this way inconsistencies can be avoided

    // TODO: disabled for now, as the server doesn't send changes back to the original user yet
    //currentElem=fabric.util.object.clone(currentElem);

    if (currentElem&&currentElem.sendMe) {
      let undoClone;
      let sendClone;
      currentElem.clone((o) => {
        undoClone = o;
      });
      currentElem.clone((o) => {
        sendClone = o;
      });
      this.undoRedoService.setCurrentlyModifiedObject([undoClone]);
      sendClone.set(property, value);
      this.undoRedoService.save(sendClone, Action.MODIFIED);
      sendClone.sendMe = false;
      this.managePagesService.sendMessageToSocket(sendClone, Action.MODIFIED);
      sendClone.sendMe = true;
    }
    // TODO: disable once server sends messages also to the origin, will be rendered by applyTransformation
    //this.canvas.renderAll();
  }

  /**
   * sets element lock properties
   * this uses the same calls as setElementProperty, but the locks would have been inconsistent
   * with the sending and undoing of actions otherwise
   */
  setElementLocks() {
    let currentElem = this.selected;
    if (currentElem&&currentElem.sendMe) {
      let undoClone;
      let sendClone;
      currentElem.clone((o) => {
        undoClone = o;
      });
      const _this = this;
      currentElem.clone((o) => {
        sendClone = o;
      });
      this.undoRedoService.setCurrentlyModifiedObject([undoClone]);
      sendClone.set('lockMovementX', this.elementProperties.lockMovement);
      sendClone.set('lockMovementY', this.elementProperties.lockMovement);
      sendClone.set('lockScalingX', this.elementProperties.lockScale);
      sendClone.set('lockScalingY', this.elementProperties.lockScale);
      sendClone.set('lockRotation', this.elementProperties.lockRotate);
      this.undoRedoService.save(sendClone, Action.MODIFIED);
      sendClone.sendMe = false;
      this.managePagesService.sendMessageToSocket(sendClone, Action.MODIFIED);
      sendClone.sendMe = true;
    }
  }

  /**
   * sets a property for each element in a group
   * @param property property to set
   * @param value new value of the property
   */
  setGroupProperty(property, value) {
    //let undoClone = [];
    //let sendClone = [];
    this.selected.forEachObject((elem) => {
      /*elem.clone((o) => {
        undoClone.push(o);
      });
      elem.clone((o) => {
        o.set(property, value);
        o.sendMe = false;
        sendClone.push(o);
      })
    });
    this.undoRedoService.setCurrentlyModifiedObject(undoClone);
    sendClone.forEach((current) => {
      this.managePagesService.sendMessageToSocket(current, Action.MODIFIED);
      current.sendMe = true;
    })*/
      elem.set(property,value);
    })

    this.canvas.renderAll();
  }

  setGroupFillColor() {
    this.setGroupProperty('fill', this.groupProperties.fillColor);
  }

  setGroupStrokeColor() {
    this.setGroupProperty('stroke', this.groupProperties.strokeColor);
  }

  setGroupStrokeWidth() {
    this.setGroupProperty('strokeWidth', this.groupProperties.strokeWidth);
  }

  setGroupOpacity() {
    this.setGroupProperty('opacity', this.groupProperties.opacity / 100);
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

    } else if(obj.type === 'group') {
      let hackedString = JSON.stringify(obj);
      let hackedParse = JSON.parse(hackedString);
      hackedParse.uuid = obj.uuid;
      toSend = [hackedParse];
    } 
    else {
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
    if (!this.isGridEnabled) {
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
    this.setElementLocks();
  }

  setElementScaleLock() {
    this.setElementLocks();
  }

  setElementRotateLock() {
    this.setElementLocks();
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
    //this.setElementProperty('underline', this.textProperties.textDecoration.underline);
    this.setElementProperty('linethrough', this.textProperties.textDecoration.linethrough);
    //console.log("underline "+this.textProperties.textDecoration.underline);
    //console.log("linethrough "+this.textProperties.textDecoration.linethrough);
  }

  setUnderline() {
    this.setElementProperty('underline', this.textProperties.textDecoration.underline);
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

    //hack
    
    //_canvas.cloneWithoutData((o) => {
      let keys = Object.keys(propertyObject);
      keys.forEach(function (key) {
        sendCanvas[key] = propertyObject[key]
        //console.log('assigning ' + JSON.stringify(propertyObject[key]) + ' to ' + key);
      });
      //console.log('canvasToSend: ' + JSON.stringify(sendCanvas))
      _pageService.sendMessageToSocket(sendCanvas, action);

    //});
  }
}
