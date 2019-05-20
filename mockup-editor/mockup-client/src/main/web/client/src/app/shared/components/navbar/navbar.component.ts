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
              private undoRedoService: UndoRedoService
          ) { }

  ngOnInit() {
    this.undoRedoService.getRedoObs().subscribe(
      (bool) => { this.redoDisabled = bool; }
    );
    this.undoRedoService.getUndoObs().subscribe(
      (bool) => { this.undoDisabled = bool; }
    );
    this.data.currentMessage.subscribe(item => {
      this.info = {
        token: this.tokenStorage.getToken(),
        username: this.tokenStorage.getUsername(),
      };
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

  onImportSVG() {
    // TODO
  }

  onExportPNG() {
    // TODO
  }

  onSaveVersion() {
    // TODO
  }

  onLoadVersion() {
    // TODO
  }

  onAllProjects() {
    this.router.navigate(['projects']);
  }

  onUndo() {
    const canvas = this.managePagesService.getCanvas();
    this.undoRedoService.undo(canvas);
  }

  onRedo() {
    const canvas = this.managePagesService.getCanvas();
    this.undoRedoService.redo(canvas);
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
