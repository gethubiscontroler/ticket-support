package com.agence.ticket_support.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Component
public class ConfigurationLogger {
	private static final Logger logger = LoggerFactory.getLogger(ConfigurationLogger.class);

	@Value("${spring.security.oauth2.client.registration.google.client-id:NOT_SET}")
	private String googleClientId;

	@Value("${spring.security.oauth2.client.registration.google.client-secret:NOT_SET}")
	private String googleClientSecret;

	@Value("${jwt.secret:NOT_SET}")
	private String jwtSecret;

	@Value("${jwt.expiration:0}")
	private long jwtExpiration;

	@Value("${app.frontend.url:NOT_SET}")
	private String frontendUrl;

	@Value("${server.port:8080}")
	private String serverPort;

	@EventListener(ApplicationReadyEvent.class)
	public void logConfigurationOnStartup() {
		logger.info("=== OAuth2 & JWT Configuration Check ===");
		logger.info("Server Port: {}", serverPort);
		logger.info("Google Client ID: {}", maskSensitiveData(googleClientId));
		logger.info("Google Client Secret: {}", maskSensitiveData(googleClientSecret));
		logger.info("Frontend URL: {}", frontendUrl);
		logger.info("JWT Secret Length: {} characters", jwtSecret.length());
		logger.info("JWT Secret : {} characters", jwtSecret);
		logger.info("JWT Expiration: {} ms ({} hours)", jwtExpiration, jwtExpiration / 3600000);
		logger.info("=========================================");

		// Check for common configuration issues
		validateConfiguration();
	}

	private void validateConfiguration() {
		boolean hasErrors = false;

		if ("NOT_SET".equals(googleClientId) || googleClientId.isEmpty()) {
			logger.error("❌ GOOGLE_CLIENT_ID is not set!");
			hasErrors = true;
		}

		if ("NOT_SET".equals(googleClientSecret) || googleClientSecret.isEmpty()) {
			logger.error("❌ GOOGLE_CLIENT_SECRET is not set!");
			hasErrors = true;
		}

		if ("NOT_SET".equals(jwtSecret) || jwtSecret.length() < 32) {
			logger.error("❌ JWT_SECRET is not set or too short (should be at least 32 characters)!");
			hasErrors = true;
		}

		if ("NOT_SET".equals(frontendUrl)) {
			logger.warn("⚠️  FRONTEND_URL is not set, using default");
		}

		if (!hasErrors) {
			logger.info("✅ Configuration validation passed!");
		}

		// Log the OAuth2 endpoints for testing
		logger.info("🔗 OAuth2 Authorization URL: http://localhost:{}/oauth2/authorization/google", serverPort);
		logger.info("🔗 OAuth2 Callback URL: http://localhost:{}/login/oauth2/code/google", serverPort);
	}

	private String maskSensitiveData(String data) {
		if (data == null || "NOT_SET".equals(data) || data.length() < 10) {
			return "NOT_SET_OR_TOO_SHORT";
		}
		return data.substring(0, 10) + "***" + data.substring(data.length() - 4);
	}

	// Getter methods for other components to use
	public String getGoogleClientId() {
		return googleClientId;
	}

	public String getFrontendUrl() {
		return frontendUrl;
	}

	public String getJwtSecret() {
		return jwtSecret;
	}
}
