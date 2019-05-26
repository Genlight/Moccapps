import { Injectable } from '@angular/core';
import { fabric } from './extendedfabric';
import { Page } from '../shared/models/Page';
import { FabricmodifyService } from './fabricmodify.service';
import { ApiService } from '../api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProjectService } from '../shared/services/project.service';
import { Project } from '../shared/models/Project';

@Injectable({
  providedIn: 'root'
})
export class ManagePagesService {

  private canvas: any;

  pages: Observable<Page[]>;
  activePage: Observable<Page>;

  private _pages: BehaviorSubject<Page[]>;
  private _activePage: BehaviorSubject<Page>;
  private _activeProject: Project;

  private dataStore: {
    pages: Page[],
    activePage: Page
  };

  constructor(
    private fabricModifyService: FabricmodifyService,
    private apiService: ApiService,
    private projectService: ProjectService
  ) {
    this._pages = new BehaviorSubject<Page[]>([]);
    this._activePage = new BehaviorSubject<Page>(null);
    
    this.dataStore = {
      pages: [],
      activePage: null
    };
    this.pages = this._pages.asObservable();
    this.activePage = this._activePage.asObservable();

    this.projectService.activeProject.subscribe((project) => {
      this._activeProject = project;
      this.loadAll();
    });
  }

  loadAll() {
    // TODO fetch pages from rest api
    if (!!this._activeProject) {
      this.apiService.get(`/project/${this._activeProject.id}/page`).subscribe(
        (data) => {
          (this.dataStore.pages as any) = data;
          this._pages.next(Object.assign({}, this.dataStore).pages);
        }
      );
    }
    
  }

  load(id: number) {
    //const projectId = 0;
    //this.apiService.get(`/project/${}`)
  }

  // TODO: change page size, possibly to relative values
  createPage( pagewidth: number, pageheight: number) {
    let page = new Page();
    page.canvas = new fabric.Canvas('canvas',
    {
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      width: pagewidth,
      height: pageheight,
      cssOnly: true
    });
    page.height = pageheight;
    page.width = pagewidth;

    this.canvas = page.canvas;
    
    //this.pages.push(page);
  // relative values can be used with setDimensions function of fabric.js
  // this.pageCanvas.setDimensions({width: '1000px', heigth: '1000px'}, {cssOnly: true});
  }

  addPage(page: Page) {
    if (!!page) {
      this.dataStore.pages.push(page);
      this._pages.next(Object.assign({}, this.dataStore).pages);
    }
  }

  /**
   * Sets a given page to active state (will be rendered).
   * 
   * Before doing so, the current workspace of the old active page will be saved.
   */
  setPageActive(page: Page) {
    if (!!page) {
      // Persist workspace of old workspace
      let oldPage = this.dataStore.activePage;
      

      this.dataStore.activePage = page;
      this._activePage.next(Object.assign({}, this.dataStore.activePage));
    }
  }

  updatePage(page: Page) {
    if (!!page) {
      this.dataStore.pages.forEach((p, i) => {
        if (!!p && !!i && p.id === page.id) {
          this.dataStore.pages[i] = page;
        }
      });
      
      this._pages.next(Object.assign({}, this.dataStore).pages);
    }
  }

  removePage(page: Page) {
    if (!!page) {
      this.dataStore.pages.forEach((p, index) => {
        if (p.id === page.id) {
          this.dataStore.pages.splice(index, 1);
        }
      });

      this._pages.next(Object.assign({}, this.dataStore).pages );
    }
  }

  // TODO: change parameter to page name or number and make pageCanvas an array
  // for now only one page implemented, so only one canvas element to manage
  getCanvas() {
    return this.canvas;
  }

}
