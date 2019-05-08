import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Project } from '../models/Project';
import { Observable } from 'rxjs';
import { ProjectUpdateRequest } from '../api/request/project-update-request';
import { isArray } from 'util';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private apiService: ApiService) { }

  getProjects<T>(): Observable<T> {
    return this.apiService.get<T>('/project');
  }

  createProject(project: Project): Observable<any> {
    return this.apiService.post('/project', project);
  }

  deleteProject(project: Project): Observable<any> {
    if (!project.id) {
      console.error(`ERROR: deleteProject: Project id is not defined`);
      return;
    }
    return this.apiService.delete(`/project/${project.id}`);
  }

  updateProject(project: Project): Observable<any> {
    const projectRequest = new ProjectUpdateRequest();
    projectRequest.id = project.id;
    projectRequest.users = project.users;
    projectRequest.projectname = project.projectname;
    const invitedUserEmails: string[] = (isArray(project.invitations)) ? project.invitations.map(invite => invite.invitee.email) : [];
    projectRequest.invitations = invitedUserEmails;
    return this.apiService.put(`/project/${project.id}`, projectRequest);
  }

  updateProjectWithRequestEntity(projectRequest: ProjectUpdateRequest): Observable<any> {
    return this.apiService.put(`/project/${projectRequest.id}`, projectRequest);
  }
}
