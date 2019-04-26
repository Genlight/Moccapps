import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricCanvasComponent } from './fabric-canvas.component';
import { FabricmodifyService } from '../fabricmodify.service';
import { ManagePagesService } from '../managepages.service';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { Observable } from 'rxjs';
import { fabric } from '../extendedfabric';
import {AppModule} from '../../app.module';

describe('FabricCanvasComponent', () => {
  let component: FabricCanvasComponent;
  let fixture: ComponentFixture<FabricCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FabricCanvasComponent ],
      providers: [ FabricmodifyService, ManagePagesService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabricCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(': object should have a UUID', () => {
    const obj = new  fabric.TextBox('textbox');
    expect(obj.uuid).toEqual(jasmine.any(String));
  });

  it(': Transformations should be observable', () => {
    let transformed = false;
    component.Transformation.subscribe({next: () => { transformed = true; }});
    component.onAddText();
    expect(transformed).toBe(true);
  });

  it('should not emit Transformations on applytransformations', () => {
    let transformed = false;
    component.Transformation.subscribe({next: () => { transformed = true; }});
    const rect = new fabric.Rect();
    component.applyTransformation(rect);
    expect(transformed).toBe(false);
  });
  it('should not emit Transformations on applyRemoval', () => {
    let transformed = false;
    component.onAddText();
    component.Transformation.subscribe({next: () => { transformed = true; }});
    const rect = new fabric.Rect();
    component.applyRemoval(rect);
    expect(transformed).toBe(false);
  });
  // it('should have called ManagePageService', () => {
  //   expect(pageService.createPage).toHaveBeenCalled();
  // });
});
