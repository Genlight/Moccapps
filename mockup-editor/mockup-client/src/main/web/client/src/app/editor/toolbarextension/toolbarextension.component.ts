import { Component, OnInit } from '@angular/core';
import { faFolder,faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { ElementsService } from '../elements.service';
import { WorkspaceService, ToolbarPanelState } from '../workspace.service';

@Component({
  selector: 'app-toolbarextension',
  templateUrl: './toolbarextension.component.html',
  styleUrls: ['./toolbarextension.component.scss']
})
export class ToolbarextensionComponent implements OnInit {

  faFolder = faFolder;
  faFolderOpen = faFolderOpen;

  /**
   * list of currently available elements with names,
   * links to source file and link to thumbnail
   * effectsAllowed is neccessary for the drop to work
   */
  draggableElements = [];
  /**
   * example structure form draggable elements
   *  [{
    name: 'Browser Window',
    data: 'assets/img/Systems/browser_window.jpg',
    effectAllowed: 'all',
    previewimage: 'assets/img/Systems/browser_window.jpg'
  }, {
      name: 'Collups Logo',
      data: 'assets/img/Logos/collups.svg',
      effectAllowed: 'all',
      previewimage: 'assets/img/Logos/collups.svg'
    }];
    */

  /**
   * list of categories
   */
  categories = [];
  /**
   * name of the currently active category
   */
  activeCategory = null;
  /**
   * map of all categories and all corresponding elements
   */
  elementMap = new Map();

  elementsFound = true;
  showComponent = false;

  constructor(
    private elementsService: ElementsService,
    private workspaceService: WorkspaceService
  ) {
    this.workspaceService.toolbarPanelState.subscribe(
      (state) => {
        if (state === ToolbarPanelState.Library) {
          this.showComponent = true;
        } else {
          this.showComponent = false;
        }
      }
    )
  }

  ngOnInit() {
    console.log("loading categories and elements....");
    this.loadCategoriesFromServer();

    //this.elementMap.set('Personal', this.elementsService.getUserElements());
    console.log(this.elementMap);
  }


  /**
   * requests a message with all available categories and the corresponding elements from the server
   * parses the messages and saves the categories in a category array, the browser window is updated accordingly
   * for each category the data of the elements is saved in an array and the element-arrays are then stored
   * in a map with the categories as keys
   */
  loadCategoriesFromServer() {
    this.elementsService.getElements()
      .subscribe(
        (response) => {
          console.log(`loadElements (response): ${JSON.stringify(response)}`);
          if (!response) {
            this.elementsFound = false;
            return;
          } else {
            this.elementsFound = true;
          }

          const stringified = JSON.parse(JSON.stringify(response));
          const parsedResponse = JSON.parse(stringified['message']);

          for (const cat in parsedResponse) {
            if (!this.categories.includes(cat)) {
              this.categories.push(cat);

              let elements = [];
              const elementarray = parsedResponse[cat];
              if (cat === 'Personal') { // load userspecific elements
                for (const elem in elementarray) {
                  const newelem = {
                    name: elementarray[elem].split('/')[1],
                    data: 'assets/img/user/'+elementarray[elem],
                    effectAllowed: 'all',
                    previewimage: 'assets/img/user/'+elementarray[elem]
                  }
                  elements.push(newelem);
                }
              } else { // load system libraries
                for (const elem in elementarray) {
                  const newelem = {
                    name: elementarray[elem],
                    data: 'assets/img/system/'+cat+'/'+elementarray[elem],
                    effectAllowed: 'all',
                    previewimage: 'assets/img/system/'+cat+'/'+elementarray[elem]
                  }
                  elements.push(newelem);
                }
              }
              this.elementMap.set(cat,elements);
            }
          }
        },
        (error) => {
          console.log("error when loading categories");
        }
    );
  }

  /**
   * loads the data of available elements of the given category in the draggableElements array
   * and updates the browser window accordingly
   * @param category category to load
   */
  loadCategory(category) {
    if (this.activeCategory !== category) {
      this.activeCategory = category;
      this.draggableElements = this.elementMap.get(category);
    } else {
      this.activeCategory = null;
      this.draggableElements = [];
    }
  }


  /**
   * logs in the console that a draggable item is being dragged
   * @param event event fired when dragging a draggable item starts
   */
  onDragStart(event: DragEvent) {
    console.log('drag started', JSON.stringify(event, null, 2));
  }

  /**
   * logs in the console that a draggable item is no longer dragged
   * @param event event fired when dragging a draggable event ends
   */
  onDragEnd(event: DragEvent) {
    console.log('drag ended', JSON.stringify(event, null, 2));
  }
}
