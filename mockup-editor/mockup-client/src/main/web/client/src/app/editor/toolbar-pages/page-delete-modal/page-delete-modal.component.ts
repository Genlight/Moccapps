import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Page } from 'src/app/shared/models/Page';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-page-delete-modal',
  templateUrl: './page-delete-modal.component.html',
  styleUrls: ['./page-delete-modal.component.scss']
})
export class PageDeleteModalComponent implements OnInit {

  pageName: string;

  @Input()
  set page(page: Page) {
    this.pageName = page.page_name;
  }
  
  @Output() 
  confirm: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public activeModal: NgbActiveModal) { 
  }

  ngOnInit() {
  }

  onDeletePage() {
    this.confirm.emit(true);
    this.activeModal.close();
  }
}
