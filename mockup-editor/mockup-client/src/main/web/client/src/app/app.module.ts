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
import { DndModule } from 'ngx-drag-drop';
import { ColorPickerModule } from 'ngx-color-picker';

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
import { UserModalComponent } from './shared/components/user-modal/user-modal.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { RequestInterceptor } from './shared/interceptor/request.interceptor';
import { LastediteddatePipe } from './shared/pipes/lastediteddate.pipe';
import { ToolbarPagesComponent } from './editor/toolbar-pages/toolbar-pages.component';
import { ToolbarGroupsComponent } from './editor/toolbar-groups/toolbar-groups.component';
import { CreateVersionModalComponent } from './shared/components/create-version-modal/create-version-modal.component';
import { LoadVersionModalComponent } from './shared/components/load-version-modal/load-version-modal.component';
import { UsercirclePipe } from './shared/pipes/usercircle.pipe';
import { PageListItemComponent } from './editor/toolbar-pages/page-list-item/page-list-item.component';
import { CommentComponent } from './editor/comment/comment.component';
import { CommentBarComponent } from './editor/comment-bar/comment-bar.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { PageDeleteModalComponent } from './editor/toolbar-pages/page-delete-modal/page-delete-modal.component';


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
    ManageUserModalComponent,
    DeleteProjectModalComponent,
    RenameProjectModalComponent,
    UserModalComponent,
    LastediteddatePipe,
    ToolbarPagesComponent,
    CreateVersionModalComponent,
    LoadVersionModalComponent,
    ToolbarPagesComponent,
    ToolbarGroupsComponent,
    UsercirclePipe,
    PageListItemComponent,
    CommentComponent,
    CommentBarComponent,
    PageDeleteModalComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    FontAwesomeModule,
    AppRoutingModule,
    HttpClientModule,
    DndModule,
    ColorPickerModule,
    AngularDraggableModule
  ],
  entryComponents: [
    ManageUserModalComponent,
    RenameProjectModalComponent,
    DeleteProjectModalComponent,
    CreateVersionModalComponent,
    LoadVersionModalComponent,
    PageDeleteModalComponent,
    UserModalComponent
  ],
  providers: [FabricmodifyService, ManagePagesService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: RequestInterceptor,
    multi: true
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
