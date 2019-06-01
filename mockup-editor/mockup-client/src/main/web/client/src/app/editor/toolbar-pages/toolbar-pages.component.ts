import { Component, OnInit } from '@angular/core';
import { Page } from 'src/app/shared/models/Page';
import { ManagePagesService } from '../managepages.service';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

/**
 * @author Yikai Yang
 * Pages sidebar
 */
@Component({
  selector: 'app-toolbar-pages',
  templateUrl: './toolbar-pages.component.html',
  styleUrls: ['./toolbar-pages.component.scss']
})
export class ToolbarPagesComponent implements OnInit {

  isVisible = true;
  faTrashAlt = faTrashAlt;

  pages: Page[] = [];
  activePage: Page;

  constructor(
    private managePagesService: ManagePagesService
  ) {
    this.managePagesService.activePage.subscribe(
      (page) => {
        this.activePage = page;
      }
    );
    this.managePagesService.pages.subscribe(
      (pages) => {
        this.pages = pages;
      }
    );
  }

  ngOnInit() {
  }

  onCreatePage() {
    const page_name = `Page ${this.pages.length + 1}`;
    this.managePagesService.addPage(page_name);
  }

  onDeletePage(page: Page) {
    if (!!page) {
      this.managePagesService.removePage(page);
    }
  }

  onClickPage(index: number, page: Page) {
    alert(`active page: index: ${index} ${JSON.stringify(page)}`);
    if (this.activePage == null || page.id !== this.activePage.id) {
      this.managePagesService.setPageActive(page);
    }
  }
}
