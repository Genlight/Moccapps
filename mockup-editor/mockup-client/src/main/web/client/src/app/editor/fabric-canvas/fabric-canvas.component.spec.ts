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
  let transformed;
  let count: number;
  const rect = new fabric.Rect();

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
    transformed = false;
    count = 0;

    component.Transformation.subscribe(function(obj) {
      transformed = true;
      console.log(`encountered object, this:` + JSON.stringify(obj));
      count = 1;
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it(': object should have a UUID', () => {
    expect(rect.uuid).toBeDefined();
  });
  it('Subject<Itransformation> should be defined', () => {
    expect(component.Transformation).toBeDefined();
  });
  it('Transformations should be observable', () => {
    component.onAddText();
    expect(transformed).toBe(true);
    // expect(component.Transformation).toBeDefined();
    expect(count).toBe(1);
  });

  it('should not emit Transformations on applytransformations', () => {
    component.applyTransformation(rect);
    expect(transformed).toBe(false);
    expect(count).toBe(0);
  });

  it('should not emit Transformations on applyRemoval', () => {
    component.applyTransformation(rect);
    component.applyRemoval(rect);

    expect(transformed).toBe(false);
    expect(component.Transformation).toBeDefined();
  });
});
