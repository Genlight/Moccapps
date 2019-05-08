package ase.message.request;

import ase.DTO.User;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@XmlRootElement
@ApiModel
public class ProjectForm implements Serializable {
    @NotNull
    @ApiModelProperty(example = "1")
    private int id;
    @NotBlank
    @ApiModelProperty(example = "projectname")
    private String projectname;
    @ApiModelProperty(dataType = "List", example = "user1,user2,user3")
    private List<User> users;
    @ApiModelProperty(dataType = "List", example = "user1,user2,user3")
    private List<String> invitations = new ArrayList<>();

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

}
