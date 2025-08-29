package com.agence.ticket_support;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class TicketSupportApplication {

	public static void main(String[] args) {
		SpringApplication.run(TicketSupportApplication.class, args);
	}

}
