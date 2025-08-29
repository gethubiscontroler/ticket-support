package com.agence.ticket_support.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


import com.agence.ticket_support.Enum.Priority;
import com.agence.ticket_support.Enum.TicketStatus;

import jakarta.persistence.*;

@Entity
@Table(name = "tickets")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Ticket {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;

	@Enumerated(EnumType.STRING)
	@Column(length = 50)
	private TicketStatus status;

	@Enumerated(EnumType.STRING)
	private Priority priority;

	private String Description;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "created_by_id")
	@JsonIgnoreProperties({"tickets", "hibernateLazyInitializer", "handler"})
	private User createdBy;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "assigned_team_id")
	@JsonIgnoreProperties({"tickets", "hibernateLazyInitializer", "handler"})
	private Team assignedTeam;

	private LocalDate creationDate;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public Priority getPriority() {
		return priority;
	}

	public void setPriority(Priority priority) {
		this.priority = priority;
	}

	public String getDescription() {
		return Description;
	}

	public void setDescription(String description) {
		Description = description;
	}

	public User getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
	}

	public Team getAssignedTeam() {
		return assignedTeam;
	}

	public void setAssignedTeam(Team assignedTeam) {
		this.assignedTeam = assignedTeam;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public TicketStatus getStatus() {
		return status;
	}

	public void setStatus(TicketStatus status) {
		this.status = status;
	}

	public LocalDate getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(LocalDate creationDate) {
		this.creationDate = creationDate;
	}
	
	public Ticket() {
    }

	public Ticket(Long id, String title, TicketStatus status, Priority priority, String description, User createdBy,
			Team assignedTeam, LocalDate creationDate) {
		super();
		this.id = id;
		this.title = title;
		this.status = status;
		this.priority = priority;
		Description = description;
		this.createdBy = createdBy;
		this.assignedTeam = assignedTeam;
		this.creationDate = creationDate;
	}

}
