package com.ntp.tpcrop.filter;

import java.io.IOException;
import java.text.ParseException;
import java.util.HashSet;
import java.util.Set;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.JWTClaimsSet;
import com.ntp.tpcrop.security.CustomUserDetails;
import com.ntp.tpcrop.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (request.getRequestURI().startsWith(String.format("%s/api/secure", request.getContextPath()))) {
            String header = request.getHeader("Authorization");

            if (header == null || !header.startsWith("Bearer ")) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing or invalid Authorization header!");
                return;
            } else {
                try {
                    String token = header.substring(7);
                    JWTClaimsSet claims = jwtUtil.validateTokenAndGetClaims(token);

                    if (claims != null) {
                        String username = claims.getSubject();
                        Long id = claims.getLongClaim("id");
                        String role = claims.getStringClaim("role");
                        Boolean isActive = claims.getBooleanClaim("isActive");

                        Set<GrantedAuthority> authorities = new HashSet<>();
                        authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
                        UserDetails userDetails = new CustomUserDetails(id, username, "", isActive, true, true, true,
                                authorities);
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                userDetails, null, authorities);
                        authentication.setDetails(id);
                        SecurityContextHolder.getContext().setAuthentication(authentication);

                        filterChain.doFilter(request, response);
                        return;
                    } else {
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token!");
                        return;
                    }
                } catch (ParseException | JOSEException e) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token!");
                    return;
                }
            }
        }
        filterChain.doFilter(request, response);
    }

}
