package ase.message.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.Set;

@ApiModel
public class SignUpForm implements Serializable {

    @NotBlank
    @ApiModelProperty(example = "username")
    private String username;

    @NotBlank
    @Email
    @ApiModelProperty(example = "email")
    private String email;

    @ApiModelProperty(example = "role")
    private Set<String> role;

    @NotBlank
    @ApiModelProperty(example = "password")
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}