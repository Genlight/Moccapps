import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Page } from 'src/app/shared/models/Page';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: '[page-list-item]',
  templateUrl: './page-list-item.component.html',
  styleUrls: ['./page-list-item.component.scss']
})
export class PageListItemComponent implements OnInit {

  @Input() 
  page: Page;

  @Input()
  isActive: boolean = false;

  editMode: boolean = false;

  @Output()
  deletePressed = new EventEmitter<Page>();

  @Output()
  pageNameChanged = new EventEmitter<String>();

  @Output()
  itemClicked = new EventEmitter();

  faTrashAlt = faTrashAlt;

  constructor() { }

  ngOnInit() {
  }

  onEnterEditMode() {
    this.editMode = true;
  }

  onLeaveEditMode(value: string) {
    //alert('leave edit mode');
    alert(value);
    this.editMode = false;
  }

  onItemClick() {
    this.itemClicked.emit();
  }

  onDeleteClick(event, page: Page) {
    event.stopPropagation();
    this.deletePressed.emit(page);
  }
}
