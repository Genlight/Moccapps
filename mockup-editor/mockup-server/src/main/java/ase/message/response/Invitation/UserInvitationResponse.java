package ase.message.response.Invitation;

import ase.DTO.Project;
import ase.DTO.User;

import java.io.Serializable;

public class UserInvitationResponse implements Serializable {
    private int id;
    private Project project;
    private Inviter inviter;

    public UserInvitationResponse(int id, ase.DTO.Project project, User user) {
        this.id = id;
        this.inviter = new Inviter(user);
        this.project = new Project(project);
    }

    private class Project implements Serializable{
        private int id;
        private String name;

        public Project(ase.DTO.Project project) {
            this(project.getId(),project.getProjectname());
        }

        public Project(int id, String name) {
            this.id = id;
            this.name = name;
        }
    }

    private class Inviter implements Serializable{
        private int id;
        private String username;
        private String email;

        public Inviter(User user) {
            this(user.getId(), user.getUsername(), user.getEmail());
        }

        public Inviter(int id, String username, String email) {
            this.id = id;
            this.username = username;
            this.email = email;
        }
    }
}

