import {Component, OnInit, OnDestroy} from '@angular/core';
import {TokenStorageService} from "../auth/token-storage.service";
import {Router} from "@angular/router";
import { ProjectService } from '../shared/services/project.service';
import { ManagePagesService } from './managepages.service';
import { Project } from '../shared/models/Project';
import { NotificationService } from '../shared/services/notification.service';
import { CommentService } from './comment.service';
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {

  activeProject: Project;

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private projectService: ProjectService,
    private pageService: ManagePagesService,
    private notificationService: NotificationService
    ) {
      this.projectService.activeProject.subscribe(
        (project) => {
          this.activeProject = project;
        }
      );
  }

  ngOnInit() {
    if (!this.tokenStorage.isLoggedIn()) {
      this.router.navigate(['']);
    }

    if (!this.activeProject) {
      this.notificationService.showError('Project state is invalid. Please try opening the project again.', 'Could not load project');
      this.router.navigate(['projects']);
    }
  }

  ngOnDestroy(): void {
  }
}
