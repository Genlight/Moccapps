import { Component, OnInit } from '@angular/core';
import { faFolder,faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { ElementsService } from '../elements.service';

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
  draggableElements = [{ 
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

  categories = ["buttons","icons","systems"];
  activeCategory = null;

  constructor(private elementsService: ElementsService) { }

  ngOnInit() {
    console.log("loading categories and elements....");
    this.loadCategoriesFromServer();
  }

  loadCategoriesFromServer() {
    this.elementsService.getElements()
      .subscribe(
        (response) => {
          console.log(`loadElements: ${JSON.stringify(response)}`);
          
        },
        (error) => {
          console.log("error when loading categories");
        }
    );
    /*
    // get list of folders from server
    const elementUrl = '/elements';
    const img = new Request(elementUrl, {
      method: 'get'
    });
    

    function onComplete(re) {
      console.log("returned: "+re);
      return re;
    }
    console.log(img);
    */
  }

  loadCategory(category) {
    this.loadCategoriesFromServer();
    if (this.activeCategory !== category) {
      this.activeCategory = category;
      this.draggableElements = [{ 
        name: 'Collups Logo',
        data: 'assets/img/Logos/collups.svg',
        effectAllowed: 'all',
        previewimage: 'assets/img/Logos/collups.svg'
      },{ 
        name: 'Browser Window',
        data: 'assets/img/Systems/browser_window.jpg',
        effectAllowed: 'all',
        previewimage: 'assets/img/Systems/browser_window.jpg'
      }];
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


