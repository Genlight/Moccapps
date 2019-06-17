import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Project } from '../models/Project';
import { Observable, BehaviorSubject } from 'rxjs';
import { ProjectUpdateRequest } from '../api/request/project-update-request';
import { isArray } from 'util';
import {Version} from "../models/Version";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private _activeProject: BehaviorSubject<Project>;

  private dataStore: {
    activeProject: Project
  };

  constructor(private apiService: ApiService) { 
    this.dataStore = {
      activeProject: null
    };
    this._activeProject = new BehaviorSubject(null);
  }

  get activeProject(): Observable<Project> {
    return this._activeProject.asObservable();
  }

  clearActiveProject(): void {
    this.dataStore.activeProject = null;
    this._activeProject.next(Object.assign({}, this.dataStore).activeProject);
  }

  setActiveProject(project: Project) {
    if (!!project) {
      this.dataStore.activeProject = project;
      this._activeProject.next(Object.assign({}, this.dataStore).activeProject);
    }
  }
  getProjectVersions<T>(project: Project): Observable<T> {
    return this.apiService.get(`/project/${project.id}/versions`);
  }

  restoreProject(version:Version): Observable<any> {
    return this.apiService.post(`/project/${version.projectId}/versions`, version);
  }

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
