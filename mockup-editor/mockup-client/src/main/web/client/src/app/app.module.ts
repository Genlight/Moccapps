import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
import { faBars, faUndo, faRedo, faComment, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { CollaboratorPipe } from './shared/pipes/collaborator.pipe';
import { FabricmodifyService } from './editor/fabricmodify.service';
import { ManagePagesService } from './editor/managepages.service';
import { ManageUserModalComponent } from './shared/components/manage-user-modal/manage-user-modal.component';
import { DeleteProjectModalComponent } from './shared/components/delete-project-modal/delete-project-modal.component';
import { RenameProjectModalComponent } from './shared/components/rename-project-modal/rename-project-modal.component';
import { CustomizepanelComponent } from './editor/customizepanel/customizepanel.component';
import { ToolbarextensionComponent } from './editor/toolbarextension/toolbarextension.component';
import { AuthInterceptor } from './auth/auth-interceptor';

library.add(faBars);
library.add(faUndo);
library.add(faRedo);
library.add(faEllipsisV);

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
    CreateProjectModalComponent,
    CustomizepanelComponent,
    ToolbarextensionComponent,
    CreateProjectModalComponent,
    ManageUserModalComponent,
    DeleteProjectModalComponent,
    RenameProjectModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    FontAwesomeModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  entryComponents: [
    ManageUserModalComponent,
    RenameProjectModalComponent,
    DeleteProjectModalComponent
  ],
  providers: [FabricmodifyService, ManagePagesService, {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
}],
  bootstrap: [AppComponent]
})
export class AppModule { }
