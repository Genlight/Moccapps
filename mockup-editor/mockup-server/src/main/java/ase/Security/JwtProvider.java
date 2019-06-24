package ase.Security;

import ase.service.UserService;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtProvider.class);
    @Autowired
    UserService userService;
    @Value("${mockup.app.jwtSecret}")
    private String jwtSecret;
    @Value("${mockup.app.jwtExpiration}")
    private int jwtExpiration;

    /**
     * returns a String representing a new JWT token, combines info from given Authentication infos
     * @param  authentication Authentication
     * @return                String
     */
    public String generateJwtToken(Authentication authentication) {

        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        logger.debug("JwtGenerator:" + authentication);

        return Jwts.builder()
                .setSubject((userPrincipal.getUsername()))
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpiration * 1000))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    /**
     * validates a JWT Token
     * @param  authToken String
     * @return           boolean
     */
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature -> Message: {} ", e);
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token -> Message: {}", e);
        } catch (ExpiredJwtException e) {
            logger.error("Expired JWT token -> Message: {}", e);
        } catch (UnsupportedJwtException e) {
            logger.error("Unsupported JWT token -> Message: {}", e);
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty -> Message: {}", e);
        }

        return false;
    }

    /**
     * returns the username from a given JWT token
     * @param  token String
     * @return       String
     */
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody().getSubject();
    }

    /**
     * returns the expiry date for a given JWT token
     * @param  token String
     * @return       Date
     */
    public Date getExpireDateFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody().getExpiration();
    }

    /**
     * returns a authentication object from a given JWT token
     * @param  token String
     * @return       Authentication
     */
    public Authentication getAuthentication(String token) {
        String username = getUserNameFromJwtToken(token);
        String oldToken = userService.getToken(username);

        if (!token.equals(oldToken)) {
            logger.debug("WRONG TOKEN!!");
            return null;
        }

        UserDetails userDetails = (UserDetails) userService.loadUserByUsername(getUserNameFromJwtToken(token));
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());


    }
}
