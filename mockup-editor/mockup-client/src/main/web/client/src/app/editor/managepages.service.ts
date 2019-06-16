import { Injectable } from '@angular/core';
import { fabric } from './extendedfabric';
import { Page } from '../shared/models/Page';
import { FabricmodifyService } from './fabricmodify.service';
import { ApiService } from '../api.service';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { ProjectService } from '../shared/services/project.service';
import { Project } from '../shared/models/Project';
import { SocketConnectionService } from '../socketConnection/socket-connection.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { socketMessage } from '../socketConnection/socketMessage';
import { Action,CanvasTransmissionProperty } from './fabric-canvas/transformation.interface';
import { isArray } from 'util';
import { NotificationService } from '../shared/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ManagePagesService {

  private canvas: fabric.Canvas;
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
    private apiService: ApiService,
    private modifyService: FabricmodifyService,
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private socketService: SocketConnectionService,
    private tokenStorage: TokenStorageService
  ) {
    this._pages = new BehaviorSubject<Page[]>([]);
    this._activePage = new BehaviorSubject<Page>(null);
    
    this.dataStore = {
      pages: [],
      activePage: null
    };
    this.pages = this._pages.asObservable();
    this.activePage = this._activePage.asObservable();

    // Handle change of project status
    this.projectService.activeProject.subscribe((project) => {
      if (!!project) {
        this._activeProject = project;
        this.loadAll();
      }
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
    //this.canvas.backgroundColor = null;
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
      oldPage.page_data = this.exportToJson(this.canvas);
      console.log(`setPageActive: saving old page: ${JSON.stringify(oldPage)}`);
      this.updatePage(oldPage);

      //Set new active page
      console.log(`setPageActive: loading new page: ${JSON.stringify(page)}`);
      this.dataStore.activePage = page;
      this._activePage.next(Object.assign({}, this.dataStore.activePage));

      //this is pretty ugly, but would need rework of multiple components otherwise
      this.disconnectSocket();
      this.connectToSocket(this._activeProject.id,this._activePage.getValue().id);

      //Load page by socket
      setTimeout(() => {
        this.loadPageBySocket(page.id);
      }, 1000);
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
      //Update page in backend,this is at the moment done by every party that receives the change
      //this.updatePage(page);
    }
  }

  /**
   * Persists the current canvas state to the backend.
   */
  saveActivePage() {
    // Persist current active page
    if (!!this.dataStore.activePage) {
      let page = Object.assign({}, this.dataStore.activePage);
      page.page_data = this.exportToJson(this.canvas);
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
      page.page_data = this.exportToJson(this.canvas);
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
          
          // Ensure page order by sorting ids ascending
          pages.sort((a,b) => (a.id - b.id));
          (this.dataStore.pages) = (data as Page[]);          
          this._pages.next(Object.assign({}, this.dataStore).pages);

          // If exists, set the first page as active
          if (!!this.dataStore.pages && isArray(this.dataStore.pages) && this.dataStore.pages.length > 0) {
            const firstPage = this.dataStore.pages[0];
            this.setPageActive(firstPage);
            this.loadGrid(2000,2000);
          }
        }
      );
    }
  }

  /**
   * Loads a page using an id from the backend and updates an existing page with the data retrieved from the backend. (via REST)
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
   * Loads a page using an id from the backend and updates an existing page with the data retrieved from the backend. (via socket)
   * @param id 
   */
  loadPageBySocket(id: number) {
    if (!!id) {
      this.sendMessageToSocket( { pageId: id} , Action.PAGELOAD);
    }
  }

  loadPageDataStore(id: number, pageData: string) {
    if (!!id && !!pageData) {
      if (!!this.dataStore.activePage && !!this.dataStore.activePage.id) {
        if (id === this.dataStore.activePage.id) {
          let currentPage = this.dataStore.activePage;
          currentPage.page_data = pageData;
          this.dataStore.activePage = currentPage;
          this._activePage.next(Object.assign({}, currentPage));
        }
      }
    } else {
      this.notificationService.showError('Received data invalid.', 'Could not load page from socket');
    }
  }

  /**
   * Creates a new Page 
   * @param name the name of the page
   * @param height height in px
   * @param width width in px
   */
  addPage(name?: string, height: number = 600, width: number = 900) {
    console.log('addPage');
    let pageName = name;
    if (!name) {
      pageName = `Page ${this.dataStore.pages.length}`;
    }

    const requestPage: Page = {
      page_name: pageName,
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
        this.addPageToStore(page);

        // Send message to other clients
        this.sendMessageToSocket(
          page
          , Action.PAGECREATED);
      }
    );
  }

  private addPageToStore(page: Page) {
    if (!!page) {
      this.dataStore.pages.push(page);
      this._pages.next(Object.assign({}, this.dataStore).pages);
    }
  }

  updatePage(page: Page) {
    console.log('updatePage');
    if (!!page) {
      this.apiService.put(`/page/${page.id}`, page).subscribe((response) => {
        // Update was successful, update element in local store.
        this.updatePageStore(page);
      });
    }
  }

  private updatePageStore(page: Page) {
    this.dataStore.pages.forEach((p, i) => {
      if (p.id === page.id) {
        this.dataStore.pages[i] = page;
        this._pages.next(Object.assign({}, this.dataStore).pages);
      }
    });
  }

  renamePage(page: Page) {
    console.log(`renamePage: ${JSON.stringify(page)}`);
    if (!!page) {
      this.sendMessageToSocket({
        pageId: page.id,
        pageName: page.page_name
      }, Action.PAGERENAMED);
    }
  }

  renamePageStore(pageId: number, pageName: string) {
    this.dataStore.pages.forEach((p, i) => {
      if (p.id === pageId) {
        let page = this.dataStore.pages[i];
        page.page_name = pageName;
        this.dataStore.pages[i] = page;
        this._pages.next(Object.assign({}, this.dataStore).pages);
      }
    });
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
          this.sendMessageToSocket({ pageId: page.id}, Action.PAGEREMOVED);
          this.removePageFromStore(page.id);
        },
        error => {
          alert(error);
        }
      );
    }
  }

  private removePageFromStore(pageId: number) {
    this.dataStore.pages.forEach((p, index) => {
      if (p.id === pageId) {
        this.dataStore.pages.splice(index, 1);
      }
    });
    // If deleted page is currently active, set it to inactive
    if (this.dataStore.activePage.id === pageId) {
      this.clearActivePage();
    }
    else if (this.dataStore.pages.length <= 0) {
      this.clearActivePage();
    }
    // Remove page if server returns http ok.
    this._pages.next(Object.assign({}, this.dataStore).pages);
  }

  /**
  * creates the grid on the grid-canvas with a distance of 10px between lines
  * @param maxWidth the width of the lines created
  * @param maxHeight the height of the lines created
  */
  loadGrid(maxWidth: number, maxHeight: number) {
    const c = this.getGridCanvas();
    const options = {
        distance: 10,
        width: maxWidth,
        height: maxHeight,
        param: {
          stroke: '#ebebeb',
          strokeWidth: 1,
          selectable: false,
          evented: false,
          opacity: 0.6
        }
    };
    const gridLen = options.width / options.distance;

    for (var i = 0; i < gridLen; i++) {
      const distance = i * options.distance;
      const horizontal = new fabric.Line([ distance, 0, distance, options.width], options.param);
      const vertical   = new fabric.Line([ 0, distance, options.width, distance], options.param);
      if( i % 5 === 0) {
        horizontal.set({stroke: '#cccccc'});
        vertical.set({stroke: '#cccccc'});
      }
      c.add(horizontal);
      c.add(vertical);
    };
    
    //this.canvas.backgroundColor = null;
    this.canvas.renderAll();
  }

  /**
   * updates the size of the underlying grid to fit the user-canvas
   * if the initial grid (2000x2000) is too small a new one is created
   */
  updateGrid() {
    const gridCanvas = this.getGridCanvas();
    gridCanvas.setWidth(this.canvas.width);
    gridCanvas.setHeight(this.canvas.height);
    if (this.canvas.height < 2000 && this.canvas.width < 2000) {
      //this.canvas.backgroundColor = null;
      //this.canvas.renderAll();
    } else {
      console.log("creating new grid");
      this.loadGrid(this.canvas.width,this.canvas.height);
    }
  }

  // Returns a canvas
  getCanvas(): fabric.Canvas {
    return this.canvas;
  }
  
  exportToJson(canvas:any):string{
    return JSON.stringify(canvas);
  }

  //TODO: this screams "refactor me properly please"
  relayChange(message:socketMessage) {
    this.handleChange(message);
    this.modifyService.applyTransformation.bind(this.modifyService)(message, this.canvas);
  }

  handleChange(message: socketMessage) {
    if (!!message) {
      let parsedObj = JSON.parse(message.content);
      switch (message.command) {
        case Action.PAGELOAD:
          console.log('page load');
          if (!!parsedObj && !!parsedObj.pageId && !!parsedObj.pageData) {
            let pageData = parsedObj.pageData;
            this.loadPageDataStore(parsedObj.id, pageData);
          } else {
            console.error('page load: received invalid data over socket connection');
            this.notificationService.showError('Received data invalid.', 'Could not load page from socket');
          }
          break;
        case Action.PAGEDIMENSIONCHANGE:
          console.log("received canvasmodify");
          let width = parsedObj[CanvasTransmissionProperty.CHANGEWIDTH];
          let height = parsedObj[CanvasTransmissionProperty.CHANGEHEIGHT];
          this.updateActivePageDimensions(height, width);
          break;
        case Action.PAGEMODIFIED:
          console.log("backgroundcolor changed to " + parsedObj.background);
          this.gridCanvas.backgroundColor = parsedObj.background;
          if (this.canvas.backgroundColor !== null) {
            this.canvas.backgroundColor = parsedObj.background;
          }
          break;
        case Action.PAGECREATED:
          const page = (parsedObj as Page);
          let pageExists = false;
          // Check if the page already exists to exclude caller from creating multiple pages.
          this.dataStore.pages.filter((p) => {
            if (p.id === page.id) {
              // Page with the same id already exists. Receiver is probably the same as caller. 
              pageExists = true;
            }
          });

          if (!pageExists) {
            // Receiver is not caller. Add page
            this.addPageToStore(page);
          }
          break;
        case Action.PAGEREMOVED:
          if (!!parsedObj && !!parsedObj.id) {
            const pageId = parsedObj.id;
            if (parsedObj.confirm === "true") {
              //Remove page
              this.removePageFromStore(pageId);
            } else {
              this.notificationService.showError("Another user is working on the page.", "Could not remove page");
            }
          }
          break;
        case Action.PAGERENAMED:
          alert('page renamed');
          if (!!parsedObj && !!parsedObj.pageId && !!parsedObj.pageName) {
            this.renamePageStore(parsedObj.pageId, parsedObj.pageName);
          }
          break;
      }
    }
  }

  //Socket methods

  connectToSocket(projectId:number,pageId:number){
    //TODO: type mismatch, why?
    this.socketService.connect(projectId.toString(),pageId.toString(),this.tokenStorage.getToken(),this.relayChange,this);
  }
  sendMessageToSocket(object: any, command: string){
    this.socketService.send(JSON.stringify(object),command);
  }

  disconnectSocket(){
    this.socketService.disconnect();
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
