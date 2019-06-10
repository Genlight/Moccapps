import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/Project';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ManagePagesService } from 'src/app/editor/managepages.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-load-version-modal',
  templateUrl: './load-version-modal.component.html',
  styleUrls: ['./load-version-modal.component.scss']
})
export class LoadVersionModalComponent implements OnInit {

  projectVersions: Project[] = [];
 
  constructor(
    public activeModal: NgbActiveModal,
    public projectService: ProjectService
  ) { }

  ngOnInit() {
    this.loadVersionsOfProject();
  }

  /**
   * TODO: Restore project.
   */
  onRestoreProject(project: Project) {
    
  }

  /**
   * Sets the project as active in the editor page.
   * (The active project is visible in the editor page.)
   */
  setProjectActive(project: Project) {
    if (!!project) {
      this.projectService.setActiveProject(project);
    }
  }

  /**
   * Loads version of project to view.
   * TODO: Replace fake projectVersions with elements retrieved from rest call.
   */
  loadVersionsOfProject() {
    this.projectVersions = [{
      projectname: "Version1",
      id: 12,
      invitations: [],
      lastEdited: new Date()
    }];
  }

}
