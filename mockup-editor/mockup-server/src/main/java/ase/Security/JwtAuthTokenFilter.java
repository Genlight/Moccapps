package ase.Security;

import ase.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtAuthTokenFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthTokenFilter.class);
    @Autowired
    private JwtProvider tokenProvider;
    @Autowired
    private UserService userService;
    /**
     * validate a given Request by a JWTtoken, provided in HttpServletRequest-Header 
     * @param  request          HttpServletRequest
     * @param  response         HttpServletResponse
     * @param  filterChain      FilterChain
     * @throws ServletException [description]
     * @throws IOException      [description]
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {

            String jwt = getJwt(request);
            if (jwt != null && tokenProvider.validateJwtToken(jwt)) {
				        Authentication auth = tokenProvider.getAuthentication(jwt);
                if (auth == null) {
                    SecurityContextHolder.clearContext();
                } else {
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        } catch (Exception e) {
            logger.error("Can NOT set user authentication -> Message: {}", e);
        }
        filterChain.doFilter(request, response);
    }

    /**
     * returns a string, representing JWT token, used in a HTTP Header
     * @param  request HttpServletRequest
     * @return         String
     */
    private String getJwt(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.replace("Bearer ", "");
        }

        return null;
    }
}
