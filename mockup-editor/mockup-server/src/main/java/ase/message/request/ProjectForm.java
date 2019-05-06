package ase.message.request;

import ase.DTO.User;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.util.List;

@XmlRootElement
@ApiModel
public class ProjectForm implements Serializable {
    @ApiModelProperty(example = "1")
    private int id;
    @ApiModelProperty(example = "projectname")
    private String projectname;
    @ApiModelProperty(dataType = "List", example = "user1,user2,user3")
    private List<User> users;
    @ApiModelProperty(dataType = "List", example = "user1,user2,user3")
    private List<User> invitedUsers;

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
        this.users.add(user);
    }

    public List<User> getInvitedUsers() {
        return invitedUsers;
    }

    public void setInvitedUsers(List<User> invitedUsers) {
        this.invitedUsers = invitedUsers;
    }

    @Override
    public String toString() {
        return "ProjectForm{" +
                "id=" + id +
                ", projectname='" + projectname + '\'' +
                ", users=" + users +
                ", invitedUsers=" + invitedUsers +
                '}';
    }
}
