package ase.message.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;

@ApiModel
public class EditUserForm implements Serializable {
    @NotBlank
    @ApiModelProperty(example = "username")
    private String username;

    @NotBlank
    //@Email
    @ApiModelProperty(example = "email")
    private String email;

    @NotBlank
    @ApiModelProperty(example = "password")
    private String password;

    @ApiModelProperty(example = "newpwd")
    private String newPassword;

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

    public String getNewPassword() {
      // if(this.newPassword == null) {
      //   return null;
      // }
      return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getEmail() {
        return email;
    }

}
