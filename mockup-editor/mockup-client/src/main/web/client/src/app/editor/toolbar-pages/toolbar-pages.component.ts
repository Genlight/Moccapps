import { Component, OnInit } from '@angular/core';
import { Page } from 'src/app/shared/models/Page';
import { ManagePagesService } from '../managepages.service';

@Component({
  selector: 'app-toolbar-pages',
  templateUrl: './toolbar-pages.component.html',
  styleUrls: ['./toolbar-pages.component.scss']
})
export class ToolbarPagesComponent implements OnInit {

  isVisible = true;

  pages: Page[] = [
    {
      id: 11,
      name: 'Page1',
      height: 600,
      width: 300,
      canvas: null,
    }
  ];

  constructor(
    private pageService: ManagePagesService
  ) 
  { 

  }

  ngOnInit() {
  }

  onCreatePage() {
    let page = new Page();
    page.id = 12;
    page.name = 'Page2';
    page.height = 400;
    page.width = 500;

    this.pages.push(page);
  }

  onDeletePage(page: Page) {
    if (!!page) {
      this.pages.splice(this.pages.indexOf(page), 1);
    }
  }
}
