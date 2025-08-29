package com.agence.ticket_support.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicController {

	@GetMapping("/health")
	public ResponseEntity<?> health() {
		return ResponseEntity.ok(Map.of("status", "OK"));
	}
}
