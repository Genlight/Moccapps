import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private apiService: ApiService) {
  }

  addProject(name: string, width: number, height: number) {
    if (name.length <= 0 || width < 0 || height < 0) {
      console.error(`Invalid parameters: Field name is empty or width is < 0 or height < 0`);
      this.apiService.post('/projects');
      //TODO
    }
  }

  getAllProjects() {
    this.apiService.get('projects');
    //TODO
  }

  getProject(id: number) {
    //TODO
  }

  updateProject() {
    //TODO
  }

  deleteProject() {
    //TODO
  }
}
