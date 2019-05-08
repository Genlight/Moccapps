import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Observable } from 'rxjs';
import { Invite } from '../models/Invite';
import { Project } from '../models/Project';

@Injectable({
  providedIn: 'root'
})
export class InviteService {

  constructor(private apiService: ApiService) { }

  getInvites<T>(): Observable<T> {
    return this.apiService.get<T>('/project/invite');
  }

  createInvite(invite: Invite): Observable<any> {
    return this.apiService.post('/project/invite', invite);
  }

  acceptInvite(invite: Invite): Observable<any> {
    return this.apiService.put(`/project/invite/${invite.id}`, {
      id: invite.id,
      action: 'accept'
    });
  }

  declineInvite(invite: Invite): Observable<any> {
    return this.apiService.put(`/project/invite/${invite.id}`, {
      id: invite.id,
      action: 'decline'
    });
  }

  deleteInvite(invite: Invite): Observable<any> {
    return this.apiService.post(`/project/invite/${invite.id}`);
  }
}
