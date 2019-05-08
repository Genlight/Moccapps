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


  static invitationForm = class {
    _projectID: number;
    _inviterID: string;
    _inviteeID: string[];


    constructor(projectID: number, inviterID: string, inviteeID: string[]) {
      this._projectID = projectID;
      this._inviterID = inviterID;
      this._inviteeID = inviteeID;
    }

  }

  constructor(private apiService: ApiService) {
  }

  getInvitations() {
    this.apiService.get('/project/invite');
  }

  /*  createInvitation(invitation: Invite) {
      //const postData = new FormData();
      // postData.append('password', user.password);
      //postData.append('projectID' , invitation.id.toString());
      //postData.append('inviterID', invitation.inviter.email);

      var stringList :string[] = [];

      invitation.invitee.forEach(function (value) {
        stringList.push(value.email);
      });

      //postData.append('inviterID', JSON.stringify(stringList));
      var temp = new InvitationService.invitationForm(invitation.project.id,invitation.inviter.email,stringList);

      this.apiService.post('/project/invite', temp);
    }

    deleteInvitation(invitation: Invite) {
      if (!invitation.id) {
        console.error(`ERROR: Invitation undefined`);
      }
      this.apiService.delete(`/project/invite/${invitation.id}`);
    }*/

  declineInvitation(invitation: Invite) {
    var temp = new InvitationService.actionMessage(invitation.id, "decline");
    this.apiService.put(`/project/invite/${invitation.id}`, temp);
  }

  acceptInvitation(invitation: Invite) {
    var temp = new InvitationService.actionMessage(invitation.id, "accept");
    this.apiService.put(`/project/invite/${invitation.id}`, temp);
  }
}
