import { Injectable } from '@angular/core';
import { fabric } from './extendedfabric';
import { Page } from '../shared/models/Page';
import { FabricmodifyService } from './fabricmodify.service';
import { ApiService } from '../api.service';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { ProjectService } from '../shared/services/project.service';
import { Project } from '../shared/models/Project';

@Injectable({
  providedIn: 'root'
})
export class ManagePagesService {

  private canvas: any;
  private gridCanvas: fabric.Canvas = null;

  pages: Observable<Page[]>;
  activePage: Observable<Page>;

  private _pages: BehaviorSubject<Page[]>;
  private _activePage: BehaviorSubject<Page>;
  private _activeProject: Project;

  private DEFAULT_PAGE_DATA: string = "{\"version\":\"2.7.0\",\"objects\":[],\"background\":\"white\"}";

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
  }

  /**
   * creates a canvas in the workspace behind the canvas the user works on, to use as a base for a grid of
   * lines to help object alignment, and sets the background color of the user-canvas to transparent, 
   * so a grid in the backgound-canvas can be seen if active
   */
  createGridCanvas() {
    this.gridCanvas = new fabric.StaticCanvas('canvasGrid',{
      evented: false, 
      height:	this.dataStore.activePage.height, 
      width: this.dataStore.activePage.width,
      backgroundColor: '#ffffff'
     });
    this.canvas.lowerCanvasEl.parentNode.appendChild(this.gridCanvas.lowerCanvasEl);
    this.canvas.backgroundColor = null;
    this.canvas.renderAll();
  }

  /**
   * Sets a given page to active state (will be rendered).
   * 
   * Before doing so, the current workspace of the old active page will be saved.
   */
  setPageActive(page: Page) {
    console.log('setPageActive');
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
      //Update page in backend
      this.updatePage(page);
    }
  }

  /**
   * Persists the current canvas state to the backend.
   */
  saveActivePage() {
    // Persist current active page
    if (!!this.dataStore.activePage) {
      let page = Object.assign({}, this.dataStore.activePage);
      page.page_data = this.fabricModifyService.exportToJson(this.canvas);
      // Save to backend
      this.updatePage(page);
      console.log(`saveActivePage: Saved to backend: ${JSON.stringify(page)}`);
    }
  }

  clearPages() {
    console.log('clearPages');
    this.dataStore.pages = [];
    this._pages.next(Object.assign({}, this.dataStore).pages);
  }

  clearActivePage() {
    console.log('clearActivePage');
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
    console.log('loadAll');
    if (!!this._activeProject) {
      this.apiService.get(`/project/${this._activeProject.id}/pages`).subscribe(
        (data) => {
          let pages = (data as Page[]);
          
          //Ensure page order by sorting ids ascending
          pages.sort((a,b) => (a.id - b.id));
          (this.dataStore.pages) = (data as Page[]);
          this._pages.next(Object.assign({}, this.dataStore).pages);
        }
      );
    }
  }

  /**
   * Loads a page using an id from the backend and updates an existing page with the data retrieved from the backend.
   */
  load(id: number) {
    this.apiService.get<Page>(`/project/${this._activeProject.id}/page/${id}`).subscribe(
      (page) => {
        if (!!page) {
          // If a local copy of the page does already exist. Update the page.
          let pageExists: boolean = false;

          this.dataStore.pages.forEach((p, i) => {
            if (p.id === page.id) {
              this.dataStore.pages[i] = page;
              this._pages.next(Object.assign({}, this.dataStore).pages);
              pageExists = true;
            }
          });
        }
      }
    )
  }

  /**
   * Creates the initial page of a project. To be called after a project has been created.
   * This method does the following steps:
   * 1) Adds page
   * 2) Set this page as active.
   * @param height the height of the initial page
   * @param width the width of the initial page
   */
  createInitialPage(height?: number, width?: number) {
    this.addPage("Page 1", height, width);
  }

  /**
   * Creates a new Page 
   * @param name the name of the page
   * @param height height in px
   * @param width width in px
   */
  addPage(name: string, height: number = 600, width: number = 900) {
    console.log('addPage');
    const requestPage: Page = {
      page_name: name,
      height: height,
      width: width,
      project_id: this._activeProject.id,
      page_data: this.DEFAULT_PAGE_DATA
    };

    //alert(JSON.stringify(requestPage));
    this.apiService.post(`/page`, requestPage).subscribe(
      response => {
        console.log('HTTP response', response);
        let page = (response as Page);
        if (!!page) {
          this.dataStore.pages.push(page);
          this._pages.next(Object.assign({}, this.dataStore).pages);
        }
      }
    );
  }

  updatePage(page: Page) {
    console.log('updatePage');
    if (!!page) {
      this.apiService.put(`/page/${page.id}`, page).subscribe((response) => {
        // Update was successful, update element in local store.
        this.dataStore.pages.forEach((p, i) => {
          if (p.id === page.id) {
            this.dataStore.pages[i] = page;
            this._pages.next(Object.assign({}, this.dataStore).pages);
          }
        });
      });
    }
  }

  /**
   * Removes the given page from the datastore.
   */
  removePage(page: Page) {
    console.log(`removePage: ${JSON.stringify(page)}`);
    if (!!page) {
      this.apiService.delete(`/page/${page.id}`).subscribe(
        response => {
          console.log('HTTP response', response);
          this.dataStore.pages.forEach((p, index) => {
            if (p.id === page.id) {
              this.dataStore.pages.splice(index, 1);
            }
          });
          
          // If deleted page is currently active, set it to inactive
          if (this.dataStore.activePage.id === page.id) {
            this.clearActivePage();
          } else if (this.dataStore.pages.length <= 0) {
            this.clearActivePage();
          }
          //Remove page if server returns http ok.
          this._pages.next(Object.assign({}, this.dataStore).pages );
        },
        error => {
          alert(error);
        }
      );
    }
  }

  // Returns a canvas
  getCanvas() {
    return this.canvas;
  }

  /**
   * returns the canvas in the background with the grid-lines or creates a new one if none exists
   */
  getGridCanvas() {
    if (this.gridCanvas === null) {
      this.createGridCanvas();
    }
    return this.gridCanvas;
  }

}
