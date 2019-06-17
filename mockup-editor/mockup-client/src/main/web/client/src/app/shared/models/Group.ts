import { Group } from 'fabric';
export class GroupPage{
  id:number;
  pageId:number;
  group:Group;

  getObjects1():Object[] {
    return this.group.getObjects();
  }
}
