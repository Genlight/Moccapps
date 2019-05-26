import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorComponent } from './editor.component';
import { AppModule } from '../app.module';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { UserModalComponent } from '../shared/components/user-modal/user-modal.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FabricCanvasComponent } from './fabric-canvas/fabric-canvas.component';
import { ToolbarextensionComponent } from './toolbarextension/toolbarextension.component';
import { CustomizepanelComponent } from './customizepanel/customizepanel.component';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DndModule } from 'ngx-drag-drop';
import { ColorPickerModule } from 'ngx-color-picker';
import { ToolbarPagesComponent } from './toolbar-pages/toolbar-pages.component';

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
        ToolbarPagesComponent,
        NgbTooltip,
        UserModalComponent
      ],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        FormsModule,
        DndModule,
        ColorPickerModule
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
