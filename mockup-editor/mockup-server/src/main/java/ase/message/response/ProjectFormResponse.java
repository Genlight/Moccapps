package ase.message.response;

import ase.DTO.InvitationU;
import ase.DTO.User;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@XmlRootElement
public class ProjectFormResponse implements Serializable {
    @NotNull
    private int id;
    @NotBlank
    private String projectname;
    private Date lastModified;
    private List<User> users;
    private List<InvitationU> invitations;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getProjectname() {
        return projectname;
    }

    public void setProjectname(String projectname) {
        this.projectname = projectname;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public Date getLastModified() {
        return lastModified;
    }

    public void setLastModified(Date lastModified) {
        this.lastModified = lastModified;
    }

    public void addUser(User user) {
        if (this.users == null) {
            this.users = new ArrayList<>();
        }
        this.users.add(user);
    }

    public void addInvitation(InvitationU invitation) {
        if (this.invitations == null) {
            this.invitations = new ArrayList<>();
        }
        this.invitations.add(invitation);
    }

    public List<InvitationU> getInvitations() {
        return invitations;
    }

    public void setInvitations(List<InvitationU> invitations) {
        this.invitations = invitations;
    }

    @Override
    public String toString() {
        return "ProjectFormResponse{" +
                "id=" + id +
                ", projectname='" + projectname + '\'' +
                ", lastModified=" + lastModified +
                ", users=" + users +
                ", invitations=" + invitations +
                '}';
    }
}
