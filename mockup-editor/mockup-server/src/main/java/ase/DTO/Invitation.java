package ase.DTO;

public class Invitation {
    private int id;
    private int project_id;
    private int inviter_user_id;
    private int invitee_user_id;
    private int status;


    public Invitation(int id, int project_id, int inviter_user_id, int invitee_user_id, int status) {
        this.id = id;
        this.project_id = project_id;
        this.inviter_user_id = inviter_user_id;
        this.invitee_user_id = invitee_user_id;
        this.status = status;
    }

    public Invitation(int project_id, int inviter_user_id, int invitee_user_id, int status) {
        this.project_id = project_id;
        this.inviter_user_id = inviter_user_id;
        this.invitee_user_id = invitee_user_id;
        this.status = status;
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

    public int getInviter_user_id() {
        return inviter_user_id;
    }

    public void setInviter_user_id(int inviter_user_id) {
        this.inviter_user_id = inviter_user_id;
    }

    public int getInvitee_user_id() {
        return invitee_user_id;
    }

    public void setInvitee_user_id(int invitee_user_id) {
        this.invitee_user_id = invitee_user_id;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Invitation{" +
                "id=" + id +
                ", project_id=" + project_id +
                ", inviter_user_id=" + inviter_user_id +
                ", invitee_user_id=" + invitee_user_id +
                ", status=" + status +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Invitation that = (Invitation) o;

        if (id != that.id) return false;
        if (project_id != that.project_id) return false;
        if (inviter_user_id != that.inviter_user_id) return false;
        if (invitee_user_id != that.invitee_user_id) return false;
        return status == that.status;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + project_id;
        result = 31 * result + inviter_user_id;
        result = 31 * result + invitee_user_id;
        result = 31 * result + status;
        return result;
    }
}
