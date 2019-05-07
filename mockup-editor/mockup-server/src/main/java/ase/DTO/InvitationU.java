package ase.DTO;

public class InvitationU {
    private int id;
    private int project_id;
    private User inviter;
    private User invitee;
    private int status;

    public InvitationU(int project_id, User inviter, User invitee, int status) {
        this.project_id = project_id;
        this.inviter = inviter;
        this.invitee = invitee;
        this.status = status;
    }

    public InvitationU(int id, int project_id, User inviter, User invitee, int status) {
        this.id = id;
        this.project_id = project_id;
        this.inviter = inviter;
        this.invitee = invitee;
        this.status = status;
    }

    public InvitationU() {

    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        InvitationU that = (InvitationU) o;

        if (id != that.id) return false;
        if (project_id != that.project_id) return false;
        if (status != that.status) return false;
        if (inviter != null ? !inviter.equals(that.inviter) : that.inviter != null)
            return false;
        return invitee != null ? invitee.equals(that.invitee) : that.invitee == null;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + project_id;
        result = 31 * result + (inviter != null ? inviter.hashCode() : 0);
        result = 31 * result + (invitee != null ? invitee.hashCode() : 0);
        result = 31 * result + status;
        return result;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getProject_id() {
        return project_id;
    }

    public void setProject_id(int project_id) {
        this.project_id = project_id;
    }

    public User getInviter() {
        return inviter;
    }

    public void setInviter(User inviter) {
        this.inviter = inviter;
    }

    public User getInvitee() {
        return invitee;
    }

    public void setInvitee(User invitee) {
        this.invitee = invitee;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "InvitationU{" +
                "id=" + id +
                ", project_id=" + project_id +
                ", inviter=" + inviter +
                ", invitee=" + invitee +
                ", status=" + status +
                '}';
    }
}
