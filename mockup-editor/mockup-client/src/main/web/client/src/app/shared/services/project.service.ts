import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Project } from '../models/Project';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private apiService: ApiService) { }

  getProjects<T>(): Observable<T> {
    return this.apiService.get<T>('/project');
  }

  createProject(project: Project) {
    this.apiService.post('/project');
  }

  deleteProject(project: Project) {
    if (!project.id) {
      console.error(`ERROR: deleteProject: Project id is not defined`);
    }
    this.apiService.delete(`/project/${project.id}`);
  }

  updateProject(project: Project) {
    this.apiService.put(`/project/${project.id}`, project);
  }
}
