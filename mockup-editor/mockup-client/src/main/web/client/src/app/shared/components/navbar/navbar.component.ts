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
import { WorkspaceService } from 'src/app/editor/workspace.service';
import save from 'save-file';
import { Page } from '../../models/Page';
import * as jsPDF from 'jspdf';
import { RenameProjectModalComponent } from '../rename-project-modal/rename-project-modal.component';

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

  projectname = 'Unknown project';
  project: Project = null;

  // Button properties for Undo / Redo
  // so that the coresp. BUtton gets disabled
  // when no more actions are possible
  redoDisabled;
  undoDisabled;

  // Activates / Deactivates show ruler button
  showRuler: boolean = false;

  activePage: Page = null;

  constructor(private router: Router, private modifyService: FabricmodifyService, private managePagesService: ManagePagesService,
              private data: DataService,
              private tokenStorage: TokenStorageService,
              private authService: AuthService,
              private modalService: NgbModal,
              private projectService: ProjectService,
              private undoRedoService: UndoRedoService,
              private workspaceService: WorkspaceService
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

    this.projectService.activeProject.subscribe((project) => {
      if (!!project) {
        this.project = project;
      }
    });

    // Handle active page changes
    this.managePagesService.activePage.subscribe((page) => {
      this.activePage = page;
    });

    // Handle show Ruler state changes
    this.workspaceService.showsRuler.subscribe((value) => {
      this.showRuler = value;
    });
  }

  onLogout() {
    this.authService.logout(new AuthLogoutInfo(this.tokenStorage.getEmail())).subscribe(
      data => {
        // this.tokenStorage.signOut();
        this.router.navigate(['']);
      }
      );
  }

  onRenameProjectName() {
    if (!!this.project) {
      const modelRef = this.modalService.open(RenameProjectModalComponent);
      modelRef.componentInstance.project = this.project;
    } else {
      console.error(`onRenameProjectName: Could not open rename modal. this.project is null`);
    }
  }

  /**
   * Exports and saves the active page as jpeg.
   */
  async onExportToJPEG() {
    const canvas = this.managePagesService.getCanvas();
    if (!!canvas) {
      const imageData = canvas.toDataURL({
        format: "jpeg"
      });
      await save(imageData, `${this.activePage.page_name}.jpeg`);
    }
  }
  
  /**
   * Exports and saves the active page as png.
   */
  async onExportToPNG() {
    const canvas = this.managePagesService.getCanvas();
    if (!!canvas) {
      const imageData = canvas.toDataURL({
        format: "png"
      });
      await save(imageData, `${this.activePage.page_name}.png`);
    }
  }

  /**
   * Exports and saves the active page as pdf.
   */
  onExportToPDF() {
    const canvas = this.managePagesService.getCanvas();
    if (!!canvas) {
      const imageData = canvas.toDataURL({
        format: "jpeg"
      });
      const pdf = new jsPDF();
      pdf.addImage(imageData, 'JPEG', 0, 0);
      pdf.save(`${this.activePage.page_name}.pdf`);
    }
  }

  onShowRuler() {
    this.workspaceService.showRuler();
  }

  onHideRuler() {
    this.workspaceService.hideRuler();
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
    alert(this.managePagesService.saveActivePage());
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
