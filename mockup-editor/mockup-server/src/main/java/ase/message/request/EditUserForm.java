package ase.message.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;
@ApiModel
public class EditUserForm implements Serializable {
    @NotBlank
    @ApiModelProperty(example = "username")
    private String username;

    @NotBlank
    @ApiModelProperty(example = "email")
    private String email;

    @ApiModelProperty(example = "password")
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        if(this.password == null) {
          return null;
        }
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }
}
