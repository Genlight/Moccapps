import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { fabric } from 'fabric';
import { FabricmodifyService } from '../fabricmodify.service';
import { ManagePagesService } from '../managepages.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';

import { Itransformation, Action } from './transformation.interface';

@Component({
  selector: 'app-fabric-canvas',
  templateUrl: './fabric-canvas.component.html',
  styleUrls: ['./fabric-canvas.component.scss']
})

export class FabricCanvasComponent implements OnInit {

  // Fabric canvas. Note: this is not html canvas.
  // http://fabricjs.com/
  private canvas: any;

  //
  public Transformation: BehaviorSubject<any>;

  constructor(private modifyService: FabricmodifyService) { }

  // TODO: manage canvas for different pages and not just one
  ngOnInit() {
    ManagePagesService.createPage();
    this.canvas = ManagePagesService.getCanvas();


    this.canvas
      .on('object:added', (evt) => { this.onTransformation(evt, Action.ADDED)})
      .on('object:modified', (evt) => { this.onTransformation(evt, Action.MODIFIED)})
      .on('object:removed', (evt) => { this.onTransformation(evt, Action.REMOVED)});
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
  /**
  *
  * @param evt - Event-object
  * @param action - one of the defined Actions,
  * which will be transmitted s. transformation.interface
  */
  onTransformation(evt, action: Action) {
    const transObject = evt.target;
    const next = ((element) => {
      if( !this.Transformation) {
        this.Transformation = new BehaviorSubject<any>(
          {'element': element, 'Action': action }
        );
        return;
      }
      this.Transformation.next({'element': element, 'Action': action });
      console.log(`${action} : ${element.uuid}`);
    });
    if (Array.isArray(transObject)) {
      transObject.forEach(next);
    } else {
      next(transObject);
    }
  }
}
