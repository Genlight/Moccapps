import { Component, OnInit } from '@angular/core';
import { Page } from 'src/app/shared/models/Page';
import { ManagePagesService } from '../managepages.service';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-toolbar-pages',
  templateUrl: './toolbar-pages.component.html',
  styleUrls: ['./toolbar-pages.component.scss']
})
export class ToolbarPagesComponent implements OnInit {

  isVisible = true;

  selectedIndex: number;
  faTrashAlt = faTrashAlt;

  pages: Page[] = [];

  constructor(
    private managePagesService: ManagePagesService
  ) {
    this.managePagesService.pages.subscribe(
      (pages) => {
        this.pages = pages;
      }
    )
  }

  ngOnInit() {
  }

  onCreatePage() {
    let page = new Page();
    page.id = Math.random() * 100 ; //TOOD: TEMP SOLUTION, remove this 
    page.page_name = `Page ${this.pages.length + 1}`;
    page.height = Math.floor(Math.random() * 5) * 100;
    page.width = Math.floor(Math.random() * 5) * 100;

    this.managePagesService.addPage(page);
    //this.pages.push(page);
  }

  onDeletePage(page: Page) {
    if (!!page) {
      this.managePagesService.removePage(page);
    }
  }

  onClickPage(index: number, page: Page) {
    alert(`active page: index: ${index} ${JSON.stringify(page)}`);
    if (+index !== null && index !== undefined) {
      this.selectedIndex = +index;
      this.managePagesService.setPageActive(page);
    }
  }
}
