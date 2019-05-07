import {Injectable} from '@angular/core';
import {ApiService} from "../../api.service";
import {Invite} from "../models/Invite";
import {HttpHeaders} from "@angular/common/http";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  static actionMessage = class {
    id: number;
    action: string;

    constructor(id: number, action: string) {
      this.id = id;
      this.action = action;
    }
  }

  constructor(private apiService: ApiService) {
  }

  getInvitations() {
    this.apiService.get('/project/invite');
  }

  createInvitation(invitation: Invite) {
    this.apiService.post('/project/invite', invitation);
  }

  deleteInvitation(invitation: Invite) {
    if (!invitation.id) {
      console.error(`ERROR: Invitation undefined`);
    }
    this.apiService.delete(`/project/invite/${invitation.id}`);
  }

  declineInvitation(invitation: Invite) {
    var temp = new InvitationService.actionMessage(invitation.id, "decline");
    this.apiService.put(`/project/invite/${invitation.id}`, temp);
  }

  acceptInvitation(invitation: Invite) {
    var temp = new InvitationService.actionMessage(invitation.id, "accept");
    this.apiService.put(`/project/invite/${invitation.id}`, temp);
  }
}
