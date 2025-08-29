package com.agence.ticket_support.controller.auth;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import com.agence.ticket_support.Enum.ERole;
import com.agence.ticket_support.dao.RoleRepository;
import com.agence.ticket_support.dao.UserRepository;
import com.agence.ticket_support.model.Role;
import com.agence.ticket_support.model.User;
import com.agence.ticket_support.payload.JwtResponse;
import com.agence.ticket_support.payload.LoginRequest;
import com.agence.ticket_support.payload.MessageResponse;
import com.agence.ticket_support.payload.SignupRequest;
import com.agence.ticket_support.security.UserPrincipal;
import com.agence.ticket_support.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

	@Autowired
	RoleRepository roleRepository;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	JwtUtil jwtUtil;

	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtil.generateJwtToken(authentication);

		UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
		List<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority)
				.collect(Collectors.toList());

		return ResponseEntity.ok(
				new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getEmail(), roles));
	}

	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
		if (userRepository.existsByUsername(signUpRequest.getUsername())) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
		}

		if (userRepository.existsByEmail(signUpRequest.getEmail())) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
		}

		// Create new user's account
		User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(),
				encoder.encode(signUpRequest.getPassword()));

		Set<String> strRoles = signUpRequest.getRole();
		Set<Role> roles = new HashSet<>();

		if (strRoles == null) {
			Role userRole = roleRepository.findByName(ERole.ROLE_USER)
					.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
			roles.add(userRole);
		} else {
			strRoles.forEach(role -> {
				switch (role) {
				case "admin":
					Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(adminRole);
					break;
				case "mod":
					Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(modRole);
					break;
				default:
					Role userRole = roleRepository.findByName(ERole.ROLE_USER)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(userRole);
				}
			});
		}

		user.setRoles(roles);
		userRepository.save(user);

		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
	}

	@GetMapping("/me")
	public ResponseEntity<?> getCurrentUser(Authentication authentication) {
		if (authentication == null) {
			return ResponseEntity.badRequest().body(new MessageResponse("User not authenticated"));
		}

		UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
		List<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority)
				.collect(Collectors.toList());

		return ResponseEntity.ok(
				new JwtResponse(null, userDetails.getId(), userDetails.getUsername(), userDetails.getEmail(), roles));
	}

	// OAuth2 specific endpoints
	@GetMapping("/oauth2/success")
	public ResponseEntity<?> oauth2LoginSuccess(Authentication authentication, 
			HttpServletRequest request, HttpServletResponse response) throws IOException {
		
		if (authentication == null || !authentication.isAuthenticated()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(new MessageResponse("OAuth2 authentication failed"));
		}

		try {
			// Handle OIDC user (Google login)
			if (authentication.getPrincipal() instanceof OidcUser) {
				OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
				
				String email = oidcUser.getEmail();
				String name = oidcUser.getFullName();
				String googleId = oidcUser.getSubject();
				
				// Create or update user in database
				User user = createOrUpdateOAuth2User(email, name, googleId);
				
				// Generate JWT token
				String jwt = jwtUtil.generateJwtTokenForOAuth2User(user);
				
				List<String> roles = user.getRoles().stream()
					.map(role -> role.getName().name())
					.collect(Collectors.toList());
				
				// Redirect to frontend with JWT token as query parameter
				String redirectUrl = "http://localhost:5173/auth/success?token=" + jwt + 
					"&user=" + java.net.URLEncoder.encode(name, "UTF-8");
				response.sendRedirect(redirectUrl);
				
				return null; // Response already sent via redirect
			}
			
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new MessageResponse("Unsupported OAuth2 provider"));
				
		} catch (Exception e) {
			System.err.println("OAuth2 success handling error: " + e.getMessage());
			e.printStackTrace();
			response.sendRedirect("http://localhost:5173/auth/error?error=" + 
				java.net.URLEncoder.encode(e.getMessage(), "UTF-8"));
			return null;
		}
	}

	@GetMapping("/oauth2/error")
	public ResponseEntity<Map<String, String>> oauth2LoginError(
			@RequestParam(required = false) String error,
			HttpServletRequest request) {
		
		Map<String, String> errorResponse = new HashMap<>();
		errorResponse.put("error", "OAuth2 Authentication failed");
		errorResponse.put("message", error != null ? error : "Unknown authentication error");
		errorResponse.put("timestamp", java.time.Instant.now().toString());
		
		// Log the error details
		System.err.println("OAuth2 authentication error: " + error);
		System.err.println("Request details: " + request.getRequestURL());
		
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
	}

	@GetMapping("/oauth2/user")
	public ResponseEntity<?> getOAuth2UserInfo(Authentication authentication) {
		if (authentication == null || !authentication.isAuthenticated()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(new MessageResponse("Not authenticated"));
		}
		
		Map<String, Object> userInfo = new HashMap<>();
		
		if (authentication.getPrincipal() instanceof OidcUser) {
			OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
			userInfo.put("name", oidcUser.getFullName());
			userInfo.put("email", oidcUser.getEmail());
			userInfo.put("picture", oidcUser.getPicture());
			userInfo.put("provider", "google");
		} else if (authentication.getPrincipal() instanceof OAuth2User) {
			OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
			userInfo.put("attributes", oauth2User.getAttributes());
			userInfo.put("provider", "oauth2");
		}
		
		userInfo.put("authenticated", true);
		userInfo.put("authorities", authentication.getAuthorities());
		
		return ResponseEntity.ok(userInfo);
	}

	// Debug endpoint
	@GetMapping("/debug")
	public ResponseEntity<Map<String, Object>> debug(HttpServletRequest request, Authentication auth) {
		Map<String, Object> info = new HashMap<>();
		info.put("authenticated", auth != null && auth.isAuthenticated());
		info.put("requestUrl", request.getRequestURL().toString());
		info.put("sessionId", request.getSession(false) != null ? request.getSession().getId() : "No session");
		
		if (auth != null) {
			info.put("principalType", auth.getPrincipal().getClass().getSimpleName());
			info.put("name", auth.getName());
			info.put("authorities", auth.getAuthorities());
		}
		
		return ResponseEntity.ok(info);
	}

	private User createOrUpdateOAuth2User(String email, String name, String googleId) {
		// Check if user exists by email
		Optional<User> existingUser = userRepository.findByEmail(email);
		
		if (existingUser.isPresent()) {
			// Update existing user
			User user = existingUser.get();
			if (user.getUsername() == null || user.getUsername().isEmpty()) {
				user.setUsername(name);
			}
			return userRepository.save(user);
		} else {
			// Create new user
			User newUser = new User();
			newUser.setEmail(email);
			newUser.setUsername(name);
			// Set a random password for OAuth2 users (they won't use it)
			newUser.setPassword(encoder.encode(java.util.UUID.randomUUID().toString()));
			
			// Assign default role
			Role userRole = roleRepository.findByName(ERole.ROLE_USER)
					.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
			Set<Role> roles = new HashSet<>();
			roles.add(userRole);
			newUser.setRoles(roles);
			
			return userRepository.save(newUser);
		}
	}
}