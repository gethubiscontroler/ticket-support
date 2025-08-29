package com.agence.ticket_support.service;

import com.agence.ticket_support.model.Ticket;

public interface EmailService {
	void sendTicketCreatedNotification(Ticket ticket);

	void sendTicketUpdatedNotification(Ticket ticket, Ticket previousTicket);

	void sendEmail(String to, String subject, String content, boolean isHtml);
}
