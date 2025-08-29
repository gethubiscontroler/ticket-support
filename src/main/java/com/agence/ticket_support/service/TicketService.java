package com.agence.ticket_support.service;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.agence.ticket_support.Enum.TicketStatus;
import com.agence.ticket_support.dto.PaginatedResponse;
import com.agence.ticket_support.model.Ticket;

public interface TicketService {

	Ticket createTicket(Ticket ticket);

	Ticket updateTicket(Long id, Ticket ticket);

	void deleteTicket(Long id);

	Ticket getTicketById(Long id);

	List<Ticket> getAllTickets();

	// New pagination methods
	PaginatedResponse<Ticket> getAllTickets(int page, int size, String sortBy, String sortDir);

	PaginatedResponse<Ticket> getTicketsByStatus(TicketStatus status, int page, int size, String sortBy,
			String sortDir);

	PaginatedResponse<Ticket> searchTickets(String keyword, int page, int size, String sortBy, String sortDir);

	Page<Ticket> getTicketsPage(Pageable pageable);
}
