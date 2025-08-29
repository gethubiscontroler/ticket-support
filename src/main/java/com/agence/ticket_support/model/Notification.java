package com.agence.ticket_support.model;

import java.time.LocalDate;
import java.util.Date;

import com.agence.ticket_support.Enum.NotificationType;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "notifications")
public class Notification {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String message;
	
	@ManyToOne
	@JoinColumn(name = "recipient_id")
	private User recipient;
	
	private LocalDate dateSent;
	
	private String readed;
	
	private NotificationType type;

	
	public NotificationType getType() {
		return type;
	}


	public void setType(NotificationType type) {
		this.type = type;
	}


	public Notification() {
    }


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public User getRecipient() {
		return recipient;
	}

	public void setRecipient(User recipient) {
		this.recipient = recipient;
	}

	public LocalDate getDateSent() {
		return dateSent;
	}

	public void setDateSent(LocalDate dateSent) {
		this.dateSent = dateSent;
	}

	public String getReaded() {
		return readed;
	}

	public void setReaded(String readed) {
		this.readed = readed;
	}


	public Notification(Long id, String message, User recipient, LocalDate dateSent, String readed, NotificationType type) {
		super();
		this.id = id;
		this.message = message;
		this.recipient = recipient;
		this.dateSent = dateSent;
		this.readed = readed;
		this.type = type;
	}
	
	
}
