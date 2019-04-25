import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProjectsComponent } from './projects/projects.component';
import { EditorComponent } from './editor/editor.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ToolbarComponent } from './editor/toolbar/toolbar.component';
import { FabricCanvasComponent } from './editor/fabric-canvas/fabric-canvas.component';
import { CreateProjectModalComponent } from './projects/create-project-modal/create-project-modal.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faUndo, faRedo, faComment } from '@fortawesome/free-solid-svg-icons';
import { CollaboratorPipe } from './shared/pipes/collaborator.pipe';
import { FabricmodifyService } from './editor/fabricmodify.service';
import { ManagePagesService } from './editor/managepages.service';

library.add(faBars);
library.add(faUndo);
library.add(faRedo);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProjectsComponent,
    EditorComponent,
    NavbarComponent,
    ToolbarComponent,
    FabricCanvasComponent,
    CollaboratorPipe,
    CreateProjectModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [FabricmodifyService, ManagePagesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
