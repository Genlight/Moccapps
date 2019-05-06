package ase.message.request.Invitation;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

public class InvitationActionForm implements Serializable{
    @NotNull
    private int id;
    @NotBlank
    private String action;

    public InvitationActionForm(int id, String action) {
        this.id = id;
        this.action = action;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}
