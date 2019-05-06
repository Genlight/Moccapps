package ase.message.request;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;

public class EditUserForm implements Serializable {
    @NotBlank
    private String username;

    @NotBlank
    private String email;

    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }
}
