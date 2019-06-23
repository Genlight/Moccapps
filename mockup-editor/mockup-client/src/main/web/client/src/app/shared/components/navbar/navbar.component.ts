import { Component, OnInit } from '@angular/core';
import { faBars, faUndo, faRedo, faCheck} from '@fortawesome/free-solid-svg-icons';
import { faCommentAlt } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import { FabricmodifyService } from '../../../editor/fabricmodify.service';
import { ManagePagesService } from '../../../editor/managepages.service';
import { fabric } from '../../../editor/extendedfabric';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserModalComponent } from '../user-modal/user-modal.component';

import {DataService} from '../../../data.service';
import {TokenStorageService} from '../../../auth/token-storage.service';
import {AuthService} from '../../../auth/auth.service';
import {AuthLogoutInfo} from '../../../auth/logout-info';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/Project';
import { UndoRedoService } from '../../services/undo-redo.service';
import { CreateVersionModalComponent } from '../create-version-modal/create-version-modal.component';
import { LoadVersionModalComponent } from '../load-version-modal/load-version-modal.component';
import { WorkspaceService } from 'src/app/editor/workspace.service';
import save from 'save-file';
import { Page } from '../../models/Page';
import * as jsPDF from 'jspdf';
import { RenameProjectModalComponent } from '../rename-project-modal/rename-project-modal.component';
import { ManageUserModalComponent } from '../manage-user-modal/manage-user-modal.component';
import { ElementsService } from 'src/app/editor/elements.service';
import { CommentService } from 'src/app/editor/comment.service';
import { CreateProjectModalComponent } from 'src/app/projects/create-project-modal/create-project-modal.component';
import { SocketConnectionService } from 'src/app/socketConnection/socket-connection.service';
import { Action } from 'src/app/editor/fabric-canvas/transformation.interface';
import {CommentEntry} from "../../models/comments";

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
  faCheck = faCheck;

  users = [
    { name: 'Alexander Genser', initials: 'AG' },
    { name: 'Bernhard Matyas' , initials: 'BM' },
    { name: 'Martin Maisriemler', initials: 'MM'},
    { name: 'Yikai Yang', initials: 'YY'},
    { name: 'Matthias Deimel', initials: 'MD'},
    { name: 'Brigitte Blank-Landeshammer', initials: 'BB'}
  ];
  info: any;

  grid: boolean = false;
  showsComment: boolean = false;
  snapToGrid: boolean = false;

  /**
   * users.map(x => `${user.split(' ')[0][0]}${user.split(' ')[1][0]}`);
   */

  // usersInitials = this.users.map(user => `${user.name.split(' ')[0][0]}${user.name.split(' ')[1][0]}`);
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

  // needed for adding comment button
  addingComment;
  constructor(private router: Router, private modifyService: FabricmodifyService, private managePagesService: ManagePagesService,
              private data: DataService,
              private tokenStorage: TokenStorageService,
              private authService: AuthService,
              private modalService: NgbModal,
              private projectService: ProjectService,
              private undoRedoService: UndoRedoService,
              private workspaceService: WorkspaceService,
              private elementsService: ElementsService,
              private commentService: CommentService,
              private socketService: SocketConnectionService
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

    // Handle active page changes
    this.managePagesService.activePage.subscribe((page) => {
      this.activePage = page;
    });

    // Handle show Ruler state changes
    this.workspaceService.showsRuler.subscribe((value) => {
      this.showRuler = value;
    });

    // Handle grid state changes
    this.workspaceService.showsGrid.subscribe((value) => {
      this.grid = value;
      this.toggleGrid();
    });

    this.workspaceService.showsComments.subscribe((value) => {
      this.showsComment = value;
    });

    /**
     * Handles project name changes from socket connection
     */
    this.workspaceService.projectName.subscribe((value) => {
      if (!!value && value.length > 1) {
        this.project.projectname = value;
      }
    });
  }

  onToggleComments() {
    if (this.showsComment) {
      this.workspaceService.hideComments();
    } else {
      this.workspaceService.showComments();
    }
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
      modelRef.componentInstance.changedName.subscribe((name) => {
        // Notify other clients of project name change
        try {
          this.socketService.send(
            JSON.stringify(
              {
                projectName: name, 
                projectID: this.project.id }), Action.PROJECTRENAMED);
        } catch (e) {
          console.warn('Could not send rename project socket message: ' + e);
        }
      });
    } else {
      console.error(`onRenameProjectName: Could not open rename modal. this.project is null`);
    }
  }

  onManageUser() {
    const modelRef = this.modalService.open(ManageUserModalComponent);
    modelRef.componentInstance.project = this.project;
    modelRef.componentInstance.confirm.subscribe(() =>
      {
        this.loadProjects()
      }
    );
  }

  onExportToJSON() {
    const canvas = this.managePagesService.getCanvas();
    const json = this.modifyService.exportToJson(canvas);
    alert(JSON.stringify(json));
    console.log('CANVAS JSON: ' + json);
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
    if (!!this.project) {
      const modelRef = this.modalService.open(CreateProjectModalComponent);
      //modelRef.componentInstance.project = this.project;
    } else {
      console.error(`onRenameProjectName: Could not open rename modal. this.project is null`);
    }
  }

  onNewPage() {
    this.managePagesService.addPage();
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
      this.elementsService.importImage(file);
    }

  }

  onExportPNG() {
    // TODO
  }

  onSaveVersion() {
    if (!!this.project) {
      const modelRef = this.modalService.open(CreateVersionModalComponent);
      modelRef.componentInstance.project = this.project;
    }
  }

  onLoadVersion() {
    if (!!this.project) {
      const modelRef = this.modalService.open(LoadVersionModalComponent);
      modelRef.componentInstance.project = this.project;
    }
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

  /**
   * activates or deactivates showing the grid in the background through toggling the
   * user-canvas color between the actual background color and transparent
   * the grid itself is always there in the grid-canvas, just hidden by the user-canvas
   */
  onViewGrid() {
    //this.grid = !this.grid;
    if (this.grid) {
      this.workspaceService.hideGrid();
    } else {
      this.workspaceService.showGrid();
    }
  }

  toggleGrid() {
    if (!!this.activePage) {
      const canvas = this.managePagesService.getCanvas();
      const gridCanvas = this.managePagesService.getGridCanvas();
      if (!!canvas && !!gridCanvas) {
        if (this.grid) {
          canvas.backgroundColor = null;
          if (this.snapToGrid) {
            this.enableSnapToGrid(10);
          }
        } else {
          canvas.backgroundColor = gridCanvas.backgroundColor;
          if (this.snapToGrid) {
            this.disableSnapToGrid();
          }
    
        }
        canvas.renderAll();
      }
    }
  }

  /**
   * activates and deactivates snap-to-grid functionality
   * to increase performance objects cannot be placed between gridlines when moving them with snap-to-grid active
   * as the grid is very fine-grained per default. it's possible to add the commented lines to the functioning code
   * so the snapping only happens when an object moves close to a gridline, but can still be placed in between lines
   */
  onSnapToGrid() {
    this.snapToGrid = !this.snapToGrid;
    if (this.snapToGrid) {
     this.enableSnapToGrid(10);
    } else {
      this.disableSnapToGrid();
    }
  }

  /**
   * adds event listens to the canvas for moving and scaling objects
   * when movig the coordinates of the base point (default: to left) are rounded to points on the grid
   * when scaling the calculations have to be made according to all 8 different possible scaling positions
   * for the top and bottom middle scaling positions only horizontal lines have to be taken into account
   * for the left and right middle positions only vertical lines have to be taken into account
   * for the 4 cornern snapping to either a horizontal or a vertical grid line is possible, depending on which one is closer
   * (scale basen on https://stackoverflow.com/questions/44147762/fabricjs-snap-to-grid-on-resize)
   * @param gridSize size of the grid to snap to
   */
  enableSnapToGrid(gridSize: number) {
    const canvas = this.managePagesService.getCanvas();
    canvas.on({
      'object:moving': (event) => {
        //if (Math.round(event.target.left / gridSize * 5) % 5 === 0 &&
        //Math.round(event.target.top / gridSize * 5) % 5 === 0) {
        event.target.set({
          left: Math.round(event.target.left / gridSize) * gridSize,
          top: Math.round(event.target.top / gridSize) * gridSize
          }).setCoords();
      // }
      },
      'object:scaling': (event) => {
        const target = event.target;
        const w = target.width * target.scaleX;
        const h = target.height * target.scaleY;
        const snap = { // round to losest snapping points
          top: Math.round(target.top / gridSize) * gridSize,
          left: Math.round(target.left / gridSize) * gridSize,
          bottom: Math.round((target.top + h) / gridSize) * gridSize,
          right: Math.round((target.left + w) / gridSize) * gridSize
        };
        const threshold = gridSize;
        const dist = { // distance from snapping points
          top: Math.abs(snap.top - target.top),
          left: Math.abs(snap.left - target.left),
          bottom: Math.abs(snap.bottom - target.top - h),
          right: Math.abs(snap.right - target.left - w)
        };
        const attrs = {
          scaleX: target.scaleX,
          scaleY: target.scaleY,
          top: target.top,
          left: target.left
        };
        switch (target.__corner) { // different snap depending on which corner is used to scale
          case 'tl': // top left
             if (dist.left < dist.top && dist.left < threshold) {
                attrs.scaleX = (w - (snap.left - target.left)) / target.width;
                attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
                attrs.top = target.top + (h - target.height * attrs.scaleY);
                attrs.left = snap.left;
             } else if (dist.top < threshold) {
                attrs.scaleY = (h - (snap.top - target.top)) / target.height;
                attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
                attrs.left = attrs.left + (w - target.width * attrs.scaleX);
                attrs.top = snap.top;
             }
             break;
          case 'mt': // middle top
             if (dist.top < threshold) {
                attrs.scaleY = (h - (snap.top - target.top)) / target.height;
                attrs.top = snap.top;
             }
             break;
          case 'tr': // top right
             if (dist.right < dist.top && dist.right < threshold) {
                attrs.scaleX = (snap.right - target.left) / target.width;
                attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
                attrs.top = target.top + (h - target.height * attrs.scaleY);
             } else if (dist.top < threshold) {
                attrs.scaleY = (h - (snap.top - target.top)) / target.height;
                attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
                attrs.top = snap.top;
             }
             break;
          case 'ml': // middle left
             if (dist.left < threshold) {
                attrs.scaleX = (w - (snap.left - target.left)) / target.width;
                attrs.left = snap.left;
             }
             break;
          case 'mr': // middle right
             if (dist.right < threshold) {
               attrs.scaleX = (snap.right - target.left) / target.width;
             }
             break;
          case 'bl': // bottom left
             if (dist.left < dist.bottom && dist.left < threshold) {
                attrs.scaleX = (w - (snap.left - target.left)) / target.width;
                attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
                attrs.left = snap.left;
             } else if (dist.bottom < threshold) {
                attrs.scaleY = (snap.bottom - target.top) / target.height;
                attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
                attrs.left = attrs.left + (w - target.width * attrs.scaleX);
             }
             break;
          case 'mb': // middle bottom
             if (dist.bottom < threshold) {
               attrs.scaleY = (snap.bottom - target.top) / target.height;
             }
             break;
          case 'br': // bottom right
             if (dist.right < dist.bottom && dist.right < threshold) {
                attrs.scaleX = (snap.right - target.left) / target.width;
                attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
             } else if (dist.bottom < threshold) {
                attrs.scaleY = (snap.bottom - target.top) / target.height;
                attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
             }
             break;
          }
        target.set(attrs);
      }
    });
  }

  disableSnapToGrid() {
    const canvas = this.managePagesService.getCanvas();
    canvas.off('object:moving');
    canvas.off('object:scaling');
  }
  /**
   * adding comment,
   * opening the comment sidebar (if implemented)
   * @return void
   */
  /*onAddComment() {
      this.commentService.setAddCommentObs(true);
  }*/

  loadProjects(): void {
    this.projectService.getProjects<Project[]>()
      .subscribe(
        (response) => {
          console.log(response);
          var currproj = this.project;
          for(let a of response) {
            if(a.id === currproj.id){
              currproj = a;
              break;
            }
          }
          this.project = currproj;
        },
      );
  }
}
