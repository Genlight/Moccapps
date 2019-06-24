import {Injectable} from '@angular/core';
import {Page} from '../shared/models/Page';
import {Group} from 'fabric';
import {GroupPage} from "../shared/models/Group";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ManageGroupsService {

  activePage: Page;
  groups: Observable<GroupPage[]>;
  private _groups: BehaviorSubject<GroupPage[]>;
  private dataStore: {
    groups: GroupPage[],
  };

  constructor() {
    this._groups = new BehaviorSubject<GroupPage[]>([]);
    this.dataStore = {
      groups: []
    };
    this.groups = this._groups.asObservable();

  }


  add(group: Group) {
    var temp = new GroupPage();
    temp.pageId = this.activePage.id;
    temp.group = group;
    temp.id = group.uuid;
    if (this.dataStore.groups.indexOf(temp) - 1) {
      //console.log("Add group:" + temp.group);
      this.dataStore.groups.push(temp);
    }
    this._groups.next(Object.assign({}, this.dataStore).groups);
  }

  remove(group: Group) {
    var temp = new GroupPage();
    temp.pageId = 1;
    temp.group = group;
    temp.id = group.uuid;

    //console.log("to removing:" + temp.id);
    this.dataStore.groups.forEach((p, index) => {
      //console.log("For each uuid:" + p.id);
      if (p.id === temp.id) {
        this.dataStore.groups.splice(index, 1);
        //console.log("removing:" + p.id + " left:" + this.dataStore.groups.length);
      }
    });
    this._groups.next(Object.assign({}, this.dataStore).groups);
  }


  load(id: number): GroupPage[] {
    let temp: GroupPage[] = [];
    this.dataStore.groups.forEach(function (value) {
      if (value.pageId == id) {
        temp.push(value);
      }
      //console.log(value);
    });
    return temp;
  }

}
