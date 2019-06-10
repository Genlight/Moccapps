import { Component, OnInit } from '@angular/core';
import { Page } from 'src/app/shared/models/Page';
import { ManagePagesService } from '../managepages.service';
import { ManageGroupsService } from '../managegroups.service';

import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import {GroupPage} from "../../shared/models/Group";

@Component({
  selector: 'app-toolbar-groups',
  templateUrl: './toolbar-groups.component.html',
  styleUrls: ['./toolbar-groups.component.scss']
})
export class ToolbarGroupsComponent implements OnInit {

  isVisible = true;
  faTrashAlt = faTrashAlt;

  groups: GroupPage[] = [];
  groupsForPage: GroupPage[] = [];

  activePage: Page;

  constructor(
    private managePagesService: ManagePagesService,
    private groupService:ManageGroupsService
  ) {
    this.groupService.groups.subscribe(
      (groups) => {
        console.log("group new group");
        this.groups = groups;
        this.groups.forEach((p, index) => {
          console.log("Group for page:"+p.pageId+" "+this.activePage.id);
          if (p.pageId === this.activePage.id) {
            this.groupsForPage.push(p);
          }
        });
      }
    );
    this.managePagesService.activePage.subscribe((page) => {
      console.log("group new page");
      this.activePage = page;
      groupService.activePage = page;
      this.groupsForPage = [];
      this.groups.forEach((p, index) => {
        if (p.pageId === this.activePage.id) {
          console.log("Group for page:"+p.pageId+" "+this.activePage.id);
          this.groupsForPage.push(p);
        }
      });
    });
  }

  ngOnInit() {
  }

/*
  onCreatePage() {
    const page_name = `Page ${this.pages.length + 1}`;
    this.managePagesService.addPage(page_name);
  }

  onDeletePage(event, page: Page) {
    event.stopPropagation();
    if (!!page) {
      this.managePagesService.removePage(page);
    }
  }*/

  onClickGroupElement(index: number, page: GroupPage) {
    console.log(`active page: index: ${index} ${JSON.stringify(page.group)}`);
    this.managePagesService.setActive(page.group._objects[index]);
    //if (this.activePage == null || page.id !== this.activePage.id) {
    //  this.managePagesService.setPageActive(page);
    //}

  }
}
