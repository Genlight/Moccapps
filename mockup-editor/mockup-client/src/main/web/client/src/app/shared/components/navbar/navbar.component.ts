import { Component, OnInit } from '@angular/core';
import { faBars, faUndo, faRedo} from '@fortawesome/free-solid-svg-icons';
import { faCommentAlt } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import { FabricmodifyService } from '../../../editor/fabricmodify.service';
import { ManagePagesService } from '../../../editor/managepages.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserModalComponent } from '../user-modal/user-modal.component';

import {DataService} from '../../../data.service';
import {TokenStorageService} from '../../../auth/token-storage.service';
import {AuthService} from '../../../auth/auth.service';
import {AuthLogoutInfo} from '../../../auth/logout-info';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/Project';
import { UndoRedoService } from '../../services/undo-redo.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  faBars = faBars;
  faUndo = faUndo;
  faRedo = faRedo;
  faCommentAlt = faCommentAlt;

  users = [
    { name: 'Alexander Genser', initials: 'AG' },
    { name: 'Bernhard Matyas' , initials: 'BM' },
    { name: 'Martin Maisriemler', initials: 'MM'},
    { name: 'Yikai Yang', initials: 'YY'},
    { name: 'Matthias Deimel', initials: 'MD'},
    { name: 'Brigitte Blank-Landeshammer', initials: 'BB'}
  ];
  info: any;




  /**
   * users.map(x => `${user.split(' ')[0][0]}${user.split(' ')[1][0]}`);
   */

  // usersInitials = this.users.map(user => `${user.name.split(' ')[0][0]}${user.name.split(' ')[1][0]}`);
  projectname = 'My project 1';
  project: Project = null;

  // Button properties for Undo / Redo
  // so that the coresp. BUtton gets disabled
  // when no more actions are possible
  redoDisabled;
  undoDisabled;

  constructor(private router: Router, private modifyService: FabricmodifyService, private managePagesService: ManagePagesService,
              private data: DataService,
              private tokenStorage: TokenStorageService,
              private authService: AuthService,
              private modalService: NgbModal,
              private projectService: ProjectService,
              private undoRedoService: UndoRedoService
          ) { }

  ngOnInit() {
    this.undoRedoService.getRedoObs().subscribe(
      (bool) => { this.redoDisabled = !bool; }
    );
    this.undoRedoService.getUndoObs().subscribe(
      (bool) => { this.undoDisabled = !bool; }
    );
    this.data.currentMessage.subscribe(item => {
      this.info = {
        token: this.tokenStorage.getToken(),
        username: this.tokenStorage.getUsername(),
      };
    });

    this.projectService.activeProject.subscribe((project) => {
      if (!!project) {
        this.project = project;
      }
    });
  }

  onLogout() {
    // this.api.logout(this.currUser.email);
    this.authService.logout(new AuthLogoutInfo(this.tokenStorage.getEmail())).subscribe(
      data => {
        // this.tokenStorage.signOut();
        this.router.navigate(['']);
      }
      );
  }

  onNewProject() {
    // TODO
  }

  onNewPage() {
    // TODO
  }

  /**
   * handles the import of images or svgs into the page
   * if the selected file is of an supported type (png,jpeg,bmp,svg) a temporary url for the file is generated
   * and used to import the file into the active page's canvas through the fabricModifyService
   * the url is then explicitely revoked again
   * when successfully executed the selected image is loaded directly into the canvas
   * @param event event generated when selecting and opening an image from the import dialog
   */
  onImportSVG(event: Event) {
    let inputElem = <HTMLInputElement>event.target;
    let file:File;
    if (inputElem.files && inputElem.files[0]) {
      file = inputElem.files[0];
    } else {
      return;
    }

    if (file.type.match('image/png') || file.type.match('image/jpeg') || file.type.match('image/bmp') || file.type.match('image/svg')) {
      const canvas = this.managePagesService.getCanvas();
      const url = window.URL.createObjectURL(file);
      this.modifyService.loadImageFromURL(canvas,url);
      window.URL.revokeObjectURL(url);
    }
    
  }

  onExportPNG() {
    // TODO
  }

  onSaveVersion() {
    // TODO
    alert(this.managePagesService.saveActivePage());
  }

  onLoadVersion() {
    // TODO
  }

  onAllProjects() {
    this.router.navigate(['projects']);
  }

  onUndo() {
    this.undoRedoService.undo();
  }

  onRedo() {
    this.undoRedoService.redo();
  }

  onCut() {
    const canvas = this.managePagesService.getCanvas();
    this.modifyService.cutElement(canvas);
  }

  onCopy() {
    const canvas = this.managePagesService.getCanvas();
    this.modifyService.copyElement(canvas);
  }

  onPaste() {
    const canvas = this.managePagesService.getCanvas();
    this.modifyService.pasteElement(canvas);
  }

  onDuplicate() {
    const canvas = this.managePagesService.getCanvas();
    this.modifyService.duplicateElement(canvas);
  }

  onDelete() {
    const canvas = this.managePagesService.getCanvas();
    this.modifyService.removeElement(canvas);
  }

  onBringToFront() {
    const canvas = this.managePagesService.getCanvas();
    this.modifyService.bringToFront(canvas);
  }

  onBringForward() {
    const canvas = this.managePagesService.getCanvas();
    this.modifyService.bringForward(canvas);
  }

  onSendBackwards() {
    const canvas = this.managePagesService.getCanvas();
    this.modifyService.sendBackwards(canvas);
  }

  onSendToBack() {
    const canvas = this.managePagesService.getCanvas();
    this.modifyService.sendToBack(canvas);
  }

  onGroup() {
    const canvas = this.managePagesService.getCanvas();
    this.modifyService.group(canvas);
  }

  onUngroup() {
    const canvas = this.managePagesService.getCanvas();
    this.modifyService.ungroup(canvas);
  }

  onEditProfile() {
    console.log('clicked oneditProfile');
    const modelRef = this.modalService.open(UserModalComponent);
    modelRef.result.then((result) => {
      if ( result === 'success' ) {
        this.info.username = this.tokenStorage.getUsername();
      }
    }, (reason) => {

    });
  }
}
