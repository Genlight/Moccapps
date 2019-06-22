import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Page } from 'src/app/shared/models/Page';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { PageDeleteModalComponent } from '../page-delete-modal/page-delete-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  @ViewChild("editInput")
  inputElement: ElementRef;

  @Output()
  deleteClicked = new EventEmitter<Page>();

  @Output()
  pageNameChanged = new EventEmitter<String>();

  @Output()
  itemClicked = new EventEmitter();

  faTrashAlt = faTrashAlt;

  constructor(
    private modalService: NgbModal
    ) { }

  ngOnInit() {
  }

  onEnterEditMode() {
    this.editMode = true;
    if (!!this.inputElement) {
      // Use timeout of 100ms to wait for angular to detect inputElement.
      setTimeout(() => {
        this.inputElement.nativeElement.focus();
      }, 100);
    }
  }

  onLeaveEditMode(value: string) {
    //alert('leave edit mode');
    this.editMode = false;
    if (!!value) {
      value = value.trim();
      if (value.length > 0) {
        this.pageNameChanged.emit(value);
      }
    }
  }

  onItemClick() {
    this.itemClicked.emit();
  }

  onDeleteClick(event, page: Page) {
    event.stopPropagation();
    const modelRef = this.modalService.open(PageDeleteModalComponent);
    modelRef.componentInstance.page = page;
    modelRef.componentInstance.confirm.subscribe(() => {
      this.deleteClicked.emit(page);
    });
  }
}
