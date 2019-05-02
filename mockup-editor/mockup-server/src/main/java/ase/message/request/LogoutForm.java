package ase.message.request;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;

public class LogoutForm implements Serializable {
    @NotBlank
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
