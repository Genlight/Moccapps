import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/Project';
import { ManagePagesService } from 'src/app/editor/managepages.service';
import { Action } from 'src/app/editor/fabric-canvas/transformation.interface';

@Component({
  selector: 'app-create-version-modal',
  templateUrl: './create-version-modal.component.html',
  styleUrls: ['./create-version-modal.component.scss']
})
export class CreateVersionModalComponent implements OnInit {

  versionName: string;
  projectRef: Project;

  @Output() 
  confirmed: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public activeModal: NgbActiveModal,
    private projectService: ProjectService,
    private pageService: ManagePagesService
  ) { }

  @Input()
  set project(project) {
    this.versionName = project.projectname;
    this.projectRef = project;
  }

  ngOnInit() {
  }

  onSaveChange() {
    this.createVersion(this.projectRef.id, this.versionName);
  }

  /**
   * Creates a copy of the current version
   * TODO : Connection to backend via socket.
   * @param projectid 
   * @param versionName 
   */
  createVersion(projectid: number, versionName: string) {
    this.pageService.sendMessageToSocket(
      {
        ProjectID: projectid,
        VersionName: versionName
      }
    , Action.VERSIONCREATED);
    //this.activeModal.close();
  }

}
