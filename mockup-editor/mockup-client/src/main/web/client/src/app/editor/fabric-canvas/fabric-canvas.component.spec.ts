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
  // let count;
  const rect = new fabric.Rect();
  const origtimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
  });

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it(': object should have a UUID', () => {
    expect(rect.uuid).toBeDefined();
  });
  it('AsyncSubject<Transformation> should be defined', () => {
    component.enableEvents();
    component.onAddText();
    expect(component.Transformation).toBeDefined();
  });
});
// describe('Async-Callbacks', () => {
  //   beforeEach((done) => {
    //     transformed = false;
    //     component.enableEvents();
    //
    //     count = 0;
    //     component.Transformation.subscribe(function(obj) {
      //       transformed = true;
      //       console.log(`encountered object, this:` + JSON.stringify(obj));
      //       count = 1;
      //     });
      //     setTimeout(function() {
        //       done();
        //     }, 9000);
        //
        //   });
        //
        //   it('Transformations should be observable', () => {
          //
          //     component.onAddText();
          //     expect(transformed).toBe(true);
          //     expect(component.Transformation).toBeDefined();
          //     expect(count).toBe(1);
          //   });
          //
          //   it('should not emit Transformations on applytransformations', () => {
            //     component.applyTransformation(rect);
            //     expect(transformed).toBe(false);
            //     expect(count).toBe(0);
            //   });
            //
            //   it('should not emit Transformations on applyRemoval', () => {
              //     component.applyTransformation(rect);
              //     component.applyRemoval(rect);
              //
              //     expect(transformed).toBe(false);
              //     expect(component.Transformation).toBeDefined();
              //   });
              // });
              //
              // afterAll(() => {
                //   jasmine.DEFAULT_TIMEOUT_INTERVAL = origtimeout;
                // });
