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

    public InvitationForm() {
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

    @Override
    public String toString() {
        return "InvitationForm{" +
                "projectID=" + projectID +
                ", inviterID='" + inviterID + '\'' +
                ", inviteeEmailList=" + inviteeEmailList +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        InvitationForm that = (InvitationForm) o;

        if (projectID != that.projectID) return false;
        if (inviterID != null ? !inviterID.equals(that.inviterID) : that.inviterID != null) return false;
        return inviteeEmailList != null ? inviteeEmailList.equals(that.inviteeEmailList) : that.inviteeEmailList == null;
    }

    @Override
    public int hashCode() {
        int result = projectID;
        result = 31 * result + (inviterID != null ? inviterID.hashCode() : 0);
        result = 31 * result + (inviteeEmailList != null ? inviteeEmailList.hashCode() : 0);
        return result;
    }
}


