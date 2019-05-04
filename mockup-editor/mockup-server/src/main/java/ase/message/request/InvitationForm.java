package ase.message.request;

import java.util.List;

public class InvitationForm {
    private int projectID;
    private int invitorID;
    List<Integer> inviteeIDList;

    public InvitationForm(int projectID, int invitorID, List<Integer> inviteeIDList) {
        this.projectID = projectID;
        this.invitorID = invitorID;
        this.inviteeIDList = inviteeIDList;
    }

    public int getProjectID() {
        return projectID;
    }

    public void setProjectID(int projectID) {
        this.projectID = projectID;
    }

    public int getInvitorID() {
        return invitorID;
    }

    public void setInvitorID(int invitorID) {
        this.invitorID = invitorID;
    }

    public List<Integer> getInviteeIDList() {
        return inviteeIDList;
    }

    public void setInviteeIDList(List<Integer> inviteeIDList) {
        this.inviteeIDList = inviteeIDList;
    }


}


