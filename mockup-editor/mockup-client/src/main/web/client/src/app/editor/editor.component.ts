import {Component, OnInit, OnDestroy} from '@angular/core';
import {TokenStorageService} from "../auth/token-storage.service";
import {Router} from "@angular/router";
import { ProjectService } from '../shared/services/project.service';
import { ManagePagesService } from './managepages.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router, 
    private tokenStorage: TokenStorageService,
    private projectService: ProjectService,
    private pageService: ManagePagesService
    ) {
  }

  ngOnInit() {
    if (!this.tokenStorage.isLoggedIn()) {
      this.router.navigate(['']);
    }
  }

  ngOnDestroy(): void {
    // Delete pages and the current active page from store,
    this.pageService.clearActivePage();
    this.pageService.clearPages();
  }
}
