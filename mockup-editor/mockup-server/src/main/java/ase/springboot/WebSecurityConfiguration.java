package ase.springboot;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;


@EnableWebSecurity
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

    private static final Logger logger= LoggerFactory.getLogger(WebSecurityConfiguration.class);

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests().antMatchers("/")
        .permitAll()
         .and().formLogin().disable()
         .csrf().disable(); //TODO
         //.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
    }

}
