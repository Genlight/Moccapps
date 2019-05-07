package ase.message.request;

import ase.DTO.User;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@XmlRootElement
public class ProjectForm implements Serializable {
    @NotNull
    private int id;
    @NotBlank
    private String projectname;
    private List<User> users;
    private List<String> invitations;

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

    public void addUser(User user) {
        if(this.users == null){
            this.users = new ArrayList<>();
        }
        this.users.add(user);
    }

    public List<String> getInvitations() {
        return invitations;
    }

    public void setInvitations(List<String> invitations) {
        this.invitations = invitations;
    }

    @Override
    public String toString() {
        return "ProjectForm{" +
                "id=" + id +
                ", projectname='" + projectname + '\'' +
                ", users=" + users +
                ", invitations=" + invitations +
                '}';
    }
}
