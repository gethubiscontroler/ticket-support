package com.agence.ticket_support.service.impl;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.agence.ticket_support.model.Ticket;
import com.agence.ticket_support.service.EmailService;

@Service
public class SimpleEmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    
    @Value("${app.mail.from}")
    private String fromEmail;
    
    @Value("${app.mail.support}")
    private String supportEmail;

    public SimpleEmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    @Async
    public void sendTicketCreatedNotification(Ticket ticket) {
        try {
            String subject = "Ticket Created Successfully - #" + ticket.getId();
            String content = createTicketCreatedTextTemplate(ticket);
            sendEmail(ticket.getCreatedBy().getEmail(), subject, content, false);
            //log.info("Ticket created notification sent for ticket ID: {}", ticket.getId());
        } catch (Exception e) {
            //log.error("Failed to send ticket created notification", e);
        }
    }

    @Override
    @Async
    public void sendTicketUpdatedNotification(Ticket ticket, Ticket previousTicket) {
        try {
            String subject = "Ticket Updated - #" + ticket.getId();
            String content = createTicketUpdatedTextTemplate(ticket, previousTicket);
            System.out.println("content ==  "+content);
            sendEmail(ticket.getCreatedBy().getEmail(), subject, content, false);
        } catch (Exception e) {
        }
    }

    @Override
    public void sendEmail(String to, String subject, String content, boolean isHtml) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content);
            mailSender.send(message);
            //log.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
           // log.error("Failed to send email to: {}", to, e);
        }
    }
    @Async
    private String createTicketCreatedTextTemplate(Ticket ticket) {
        return String.format("""
            Hello %s,

            Your support ticket has been created successfully!

            Ticket Details:
            ===============
            Ticket ID: #%d
            Title: %s
            Status: %s
            Priority: %s
            Assigned Team: %s

            Description:
            %s

            Thank you for contacting our support team. We'll get back to you as soon as possible.


            ---
            This is an automated message. Please do not reply to this email.
            """,
            ticket.getCreatedBy().getName(),
            ticket.getId(),
            ticket.getTitle(),
            ticket.getStatus().name(),
            ticket.getPriority().name(),
            //dateFormat.format(ticket.getCreationDate()),
            ticket.getAssignedTeam() != null ? ticket.getAssignedTeam().getName() : "Not assigned",
            ticket.getDescription()
        );
    }

    private String createTicketUpdatedTextTemplate(Ticket ticket, Ticket previousTicket) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMM yyyy HH:mm");
        StringBuilder changes = new StringBuilder();
        
        if (!ticket.getStatus().equals(previousTicket.getStatus())) {
            changes.append(String.format("- Status: %s → %s\n", 
                previousTicket.getStatus().name(), ticket.getStatus().name()));
        }
        if (!ticket.getPriority().equals(previousTicket.getPriority())) {
            changes.append(String.format("- Priority: %s → %s\n", 
                previousTicket.getPriority().name(), ticket.getPriority().name()));
        }
        if (!ticket.getTitle().equals(previousTicket.getTitle())) {
            changes.append("- Title has been updated\n");
        }
        if (!ticket.getDescription().equals(previousTicket.getDescription())) {
            changes.append("- Description has been updated\n");
        }
        
        return String.format("""
            Hello %s,

            Your support ticket has been updated.

            Changes Made:
            =============
            %s

            Current Ticket Information:
            ==========================
            Ticket ID: #%d
            Title: %s
            Status: %s
            Priority: %s
            Updated Date: %s
            Assigned Team: %s

            This ticket will continue to be monitored by our support team.

            For any questions, contact us at: %s

            ---
            This is an automated message. Please do not reply to this email.
            """,
            ticket.getCreatedBy().getName(),
            changes.toString().isEmpty() ? "No significant changes detected" : changes.toString(),
            ticket.getId(),
            ticket.getTitle(),
            ticket.getStatus().name(),
            ticket.getPriority().name(),
            dateFormat.format(new Date()),
            ticket.getAssignedTeam() != null ? ticket.getAssignedTeam().getName() : "Not assigned",
            supportEmail
        );
    }
}
