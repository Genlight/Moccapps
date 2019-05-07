import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbarextension',
  templateUrl: './toolbarextension.component.html',
  styleUrls: ['./toolbarextension.component.scss']
})
export class ToolbarextensionComponent implements OnInit {

  /**
   * list of currently available elements with names,
   * links to source file and link to thumbnail
   * effectsAllowed is neccessary for the drop to work
   */
  draggableElements = [{ 
    name: 'Browser Window',
    data: 'assets/img/browser_window.jpg',
    effectAllowed: 'all',
    image: 'assets/img/browser_window.jpg'
  }, { 
      name: 'Collups Logo',
      data: 'assets/img/collups.svg',
      effectAllowed: 'all',
      image: 'assets/img/collups.svg'
    }];

  constructor() { }

  ngOnInit() {
  }

  /**
   * logs in the console that a draggable is being dragged
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


