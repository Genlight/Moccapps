import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorComponent } from './editor.component';
import { AppModule } from '../app.module';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FabricCanvasComponent } from './fabric-canvas/fabric-canvas.component';
import { ToolbarextensionComponent } from './toolbarextension/toolbarextension.component';
import { CustomizepanelComponent } from './customizepanel/customizepanel.component';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        EditorComponent, 
        NavbarComponent, 
        ToolbarComponent,
        FabricCanvasComponent,
        ToolbarextensionComponent,
        CustomizepanelComponent,
        FaIconComponent,
        NgbTooltip
      ],
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
