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


  // TODO: change page size, possibly to relative values
  createPage( pagewidth: number, pageheight: number) {

    let canvas = new fabric.Canvas('canvas',
    {
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      width: pagewidth,
      height: pageheight,
      cssOnly: true
    });

    this.canvas = canvas;
    
    //this.pages.push(page);
  // relative values can be used with setDimensions function of fabric.js
  // this.pageCanvas.setDimensions({width: '1000px', heigth: '1000px'}, {cssOnly: true});
  }

  /**
   * Sets a given page to active state (will be rendered).
   * 
   * Before doing so, the current workspace of the old active page will be saved.
   */
  setPageActive(page: Page) {
    if (!!page) {
      // Persist workspace of old workspace
      let oldPage = Object.assign({}, this.dataStore.activePage);
      oldPage.page_data = this.fabricModifyService.exportToJson(this.canvas);
      console.log(`setPageActive: saving old page: ${JSON.stringify(oldPage)}`);
      this.updatePage(oldPage);

      //Set new active page
      console.log(`setPageActive: loading new page: ${JSON.stringify(page)}`);
      this.dataStore.activePage = page;
      this._activePage.next(Object.assign({}, this.dataStore.activePage));
    }
  }

  /**
   * Updates the active page dimensions and saves the current canvas status to the active page
   * @param height 
   * @param width 
   */
  updateActivePageDimensions(height: number, width: number) {
    if (!!height && !!width && height >= 0 && width >= 0) {
      let page = Object.assign({}, this.dataStore.activePage);
      page = this.saveCanvasDataToPage(page);
      page.height = height;
      page.width = width;
      this.dataStore.activePage = page;
      this._activePage.next(Object.assign({}, this.dataStore.activePage));
    }
  }

  clearPages() {
    this.dataStore.pages = [];
    this._pages.next(Object.assign({}, this.dataStore).pages);
  }

  clearActivePage() {
    alert('clearActivePage');
    this.dataStore.activePage = null;
    this._activePage.next(null);
  }

  /**
   * Saves the current state of the canvas to the given page object.
   * @param page the page in which the canvas string should be saved to.
   */
  private saveCanvasDataToPage(page: Page): Page {
    if (!!page) {
      page.page_data = this.fabricModifyService.exportToJson(this.canvas);
    }
    return page;
  }


  /**
   * REST
   */

   /**
    * Loads all pages from the current project and saves them to the store if successful.
    */
  loadAll() {
    // TODO fetch pages from rest api
    if (!!this._activeProject) {
      this.apiService.get(`/project/${this._activeProject.id}/pages`).subscribe(
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

  addPage(name: string, height: number = 600, width: number = 900) {
    const requestPage: Page = {
      page_name: name,
      height: height,
      width: width,
      project_id: this._activeProject.id
    };
    this.apiService.post(`/page`, requestPage).subscribe(
      response => {
        alert(response);
      },
      error => {
        alert(error);
      }
    );

    let page = new Page();
    page.id = Math.floor(Math.random() * 100); //TOOD: TEMP SOLUTION, remove this 
    page.page_name = name;
    page.height = height;
    page.width = width;
    page.project_id = this._activeProject.id;

    if (!!page) {
      this.dataStore.pages.push(page);
      this._pages.next(Object.assign({}, this.dataStore).pages);
    }
  }

  updatePage(page: Page) {
    if (!!page) {
      this.dataStore.pages.forEach((p, i) => {
        if (p.id === page.id) {
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

          if (this.dataStore.pages.length <= 0) {
            this.clearActivePage();
          }
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
