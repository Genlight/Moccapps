package ase.message.request.Invitation;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

public class InvitationForm {
    @NotNull
    private int projectID;
    @NotBlank
    private String inviterID;
@NotNull
    List<String> inviteeEmailList;

    public InvitationForm(int projectID, String inviterID, List<String> inviteeEmailList) {
        this.projectID = projectID;
        this.inviterID = inviterID;
        this.inviteeEmailList = inviteeEmailList;
    }

    public int getProjectID() {
        return projectID;
    }

    public void setProjectID(int projectID) {
        this.projectID = projectID;
    }

    public String getInvitorID() {
        return inviterID;
    }

    public void setInvitorID(String invitorID) {
        this.inviterID = invitorID;
    }

    public List<String> getInviteeEmailList() {
        return inviteeEmailList;
    }

    public void setInviteeEmailList(List<String> inviteeEmailList) {
        this.inviteeEmailList = inviteeEmailList;
    }
}


