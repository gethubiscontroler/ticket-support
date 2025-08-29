package com.agence.ticket_support.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.agence.ticket_support.model.User;
import com.agence.ticket_support.security.UserPrincipal;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMs}")
    private int jwtExpirationMs;

    public String generateJwtToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        return generateTokenFromUsername(userPrincipal.getUsername());
    }

    public String generateTokenFromUsername(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String subject) {
    	System.out.println("jwtSecret " +jwtSecret);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSignKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    private Key getSignKey() {
    	System.out.println("jwtSecret " +jwtSecret);
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String getUsernameFromJwtToken(String token) {
    	System.out.println("jwtSecret " +jwtSecret);
        return extractClaim(token, Claims::getSubject);
    }

    public Date getExpirationDateFromJwtToken(String token) {
    	System.out.println("jwtSecret " +jwtSecret);
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    	System.out.println("jwtSecret " +jwtSecret);
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
    	System.out.println("jwtSecret " +jwtSecret);
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
    	System.out.println("jwtSecret " +jwtSecret);
        return getExpirationDateFromJwtToken(token).before(new Date());
    }

    public Boolean validateJwtToken(String authToken) {
    	System.out.println("jwtSecret " +jwtSecret);
        try {
            Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(authToken);
            return true;
        } catch (MalformedJwtException e) {
            System.err.println("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.err.println("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.err.println("JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println("JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
    	System.out.println("jwtSecret " +jwtSecret);
        final String username = getUsernameFromJwtToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
    
    public String generateJwtTokenForOAuth2User(User user) {
        // Create a UserPrincipal from the User entity
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        
        return Jwts.builder()
            .setSubject(userPrincipal.getUsername())
            .claim("userId", user.getId())
            .claim("email", user.getEmail())
            .claim("roles", user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList()))
            .setIssuedAt(new Date())
            .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }
}