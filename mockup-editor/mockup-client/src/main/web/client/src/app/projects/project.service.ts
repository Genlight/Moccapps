import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor() { }

  addProject(name: string, width: number, height: number) {
    if (name.length <= 0 || width < 0 || height < 0) {
      console.error(`Invalid parameters: Field name is empty or width is < 0 or height < 0`);
    }

    
  }
}
