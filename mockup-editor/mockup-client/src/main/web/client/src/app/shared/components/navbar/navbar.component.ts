import { Component, OnInit } from '@angular/core';
import { faBars, faUndo, faRedo} from '@fortawesome/free-solid-svg-icons';
import { faCommentAlt } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import { FabricmodifyService } from '../../../editor/fabricmodify.service';
import { ManagePagesService } from '../../../editor/managepages.service';

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

  /**
   * users.map(x => `${user.split(' ')[0][0]}${user.split(' ')[1][0]}`);
   */

  // usersInitials = this.users.map(user => `${user.name.split(' ')[0][0]}${user.name.split(' ')[1][0]}`);
  projectname = 'My project 1';

  constructor(private router: Router, private modifyService: FabricmodifyService) { }

  ngOnInit() {
  }

  onLogout() {
    this.router.navigate(['']);
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

  onUndo() {
    // TODO
  }

  onRedo() {
    // TODO
  }

  onCut() {
    const canvas = ManagePagesService.getCanvas();
    this.modifyService.cutElement(canvas);
  }

  onCopy() {
    const canvas = ManagePagesService.getCanvas();
    this.modifyService.copyElement(canvas);
  }

  onPaste() {
    const canvas = ManagePagesService.getCanvas();
    this.modifyService.pasteElement(canvas);
  }

  onDuplicate() {
    const canvas = ManagePagesService.getCanvas();
    this.modifyService.duplicateElement(canvas);
  }

  onDelete() {
    const canvas = ManagePagesService.getCanvas();
    this.modifyService.removeElement(canvas);
  }

  onBringToFront() {
    const canvas = ManagePagesService.getCanvas();
    this.modifyService.bringToFront(canvas);
  }

  onBringForward() {
    const canvas = ManagePagesService.getCanvas();
    this.modifyService.bringForward(canvas);
  }

  onSendBackwards() {
    const canvas = ManagePagesService.getCanvas();
    this.modifyService.sendBackwards(canvas);
  }

  onSendToBack() {
    const canvas = ManagePagesService.getCanvas();
    this.modifyService.sendToBack(canvas);
  }

  onGroup() {
    const canvas = ManagePagesService.getCanvas();
    this.modifyService.group(canvas);
  }

  onUngroup() {
    const canvas = ManagePagesService.getCanvas();
    this.modifyService.ungroup(canvas);
  }
}
