package ase.message.request.Invitation;

import javax.validation.constraints.NotNull;
import java.util.List;

public class InvitationForm {
    @NotNull
    private int projectID;
    @NotNull
    List<String> inviteeEmailList;

    public InvitationForm(int projectID, List<String> inviteeEmailList) {
        this.projectID = projectID;
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

    public List<String> getInviteeEmailList() {
        return inviteeEmailList;
    }

    public void setInviteeEmailList(List<String> inviteeEmailList) {
        this.inviteeEmailList = inviteeEmailList;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        InvitationForm that = (InvitationForm) o;

        if (projectID != that.projectID) return false;
        return inviteeEmailList != null ? inviteeEmailList.equals(that.inviteeEmailList) : that.inviteeEmailList == null;
    }

    @Override
    public int hashCode() {
        int result = projectID;
        result = 31 * result + (inviteeEmailList != null ? inviteeEmailList.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "InvitationForm{" +
                "projectID=" + projectID +
                ", inviteeEmailList=" + inviteeEmailList +
                '}';
    }
}


