/* import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricCanvasComponent } from './fabric-canvas.component';
import { FabricmodifyService } from '../fabricmodify.service';
import { ManagePagesService } from '../managepages.service';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { Observable } from 'rxjs';
import { fabric } from '../extendedfabric';
import { DndModule } from 'ngx-drag-drop';
import { HttpClientModule } from '@angular/common/http';

describe('FabricCanvasComponent', () => {
  let component: FabricCanvasComponent;
  let fixture: ComponentFixture<FabricCanvasComponent>;
  let transformed;
  let count: number;
  const rect = new fabric.Rect();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FabricCanvasComponent ],
      providers: [ FabricmodifyService, ManagePagesService],
      imports: [ DndModule, HttpClientModule ],
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
});
 */