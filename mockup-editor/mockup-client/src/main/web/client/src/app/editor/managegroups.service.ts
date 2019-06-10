import {Injectable} from '@angular/core';
import {Page} from '../shared/models/Page';
import { Group } from 'fabric';
import {ApiService} from '../api.service';
import {GroupPage} from "../shared/models/Group";
import {ManagePagesService} from "./managepages.service";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ManageGroupsService {

  private canvas: any;
  activePage: Page;
  groups: Observable<GroupPage[]>;
  private _groups: BehaviorSubject<GroupPage[]>;
  private dataStore: {
    groups: GroupPage[],
  };

  constructor(
    private apiService: ApiService,
  ) {
    this._groups = new BehaviorSubject<GroupPage[]>([]);
    this.dataStore = {
      groups: []
    };

    this.groups = this._groups.asObservable();

  }


  // TODO: change page size, possibly to relative values
  add( group: Group) {
    var temp = new GroupPage();
    temp.pageId=this.activePage.id;
    temp.group=group;
    temp.id=group.uuid;
    this.dataStore.groups.push(temp);
    this._groups.next(Object.assign({}, this.dataStore).groups);
  }

  // TODO: change page size, possibly to relative values
  remove( group: Group) {
    var temp = new GroupPage();
    temp.pageId=1;
    temp.group=group;
    temp.id=group.uuid;

    console.log("to removing:"+temp.id);
    this.dataStore.groups.forEach((p, index) => {
      console.log("For each uuid:"+p.id)
      if (p.id === temp.id) {
        this.dataStore.groups.splice(index, 1);
        console.log("removing:"+p.id+" left:"+this.dataStore.groups.length);
      }
    });
    this._groups.next(Object.assign({}, this.dataStore).groups);
  }



  /**
   * Loads a page using an id from the backend and updates an existing page with the data retrieved from the backend.
   */
  load(id: number):GroupPage[] {
    let temp: GroupPage[] = [];
    this.dataStore.groups.forEach(function (value) {
      if (value.pageId==id){
        temp.push(value);
      }
      console.log(value);
    });
    return temp;
  }

  /**
   * Removes the given page from the datastore.
   *//*
  removePage(page: Page) {
    console.log(`removePage: ${JSON.stringify(page)}`);
    if (!!page) {
      this.apiService.delete(`/page/${page.id}`).subscribe(
        response => {
          console.log('HTTP response', response);
          this.dataStore.pages.forEach((p, index) => {
            if (p.id === page.id) {
              this.dataStore.pages.splice(index, 1);
            }
          });
          
          // If deleted page is currently active, set it to inactive
          if (this.dataStore.activePage.id === page.id) {
            this.clearActivePage();
          } else if (this.dataStore.pages.length <= 0) {
            this.clearActivePage();
          }
          //Remove page if server returns http ok.
          this._pages.next(Object.assign({}, this.dataStore).pages );
        },
        error => {
          alert(error);
        }
      );
    }
  }
*/

}
