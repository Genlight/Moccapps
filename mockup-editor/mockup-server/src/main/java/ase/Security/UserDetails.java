package ase.Security;

import ase.DTO.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;

import java.io.Serializable;
import java.util.Collection;
import java.util.Objects;

public class UserDetails implements org.springframework.security.core.userdetails.UserDetails, Serializable {

    private int id;
    private String username; //username = email because email is identifier

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    public UserDetails(int id,
                       String username, String password,
                       Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
    }

    public UserDetails(int id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    public static UserDetails build(User user) {

        return new UserDetails(
                user.getId(),
                user.getEmail(),
                user.getPassword()
        );
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UserDetails user = (UserDetails) o;
        return Objects.equals(id, user.id);
    }
}
