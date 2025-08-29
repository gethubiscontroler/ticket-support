package com.agence.ticket_support.service.impl;

import java.util.List;
import java.util.Objects;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.agence.ticket_support.Enum.NotificationType;
import com.agence.ticket_support.dao.NotificationRepository;
import com.agence.ticket_support.dao.TicketRepository;
import com.agence.ticket_support.model.Notification;
import com.agence.ticket_support.model.Ticket;
import com.agence.ticket_support.model.User;
import com.agence.ticket_support.service.EmailService;
import com.agence.ticket_support.service.TicketService;
import com.agence.ticket_support.service.UserService;

import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.agence.ticket_support.Enum.TicketStatus;
import com.agence.ticket_support.dto.PaginatedResponse;


@Service
@Transactional
public class TicketServiceImpl implements TicketService {
    
    private final TicketRepository ticketRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final EmailService emailService;
    private final UserService userService;

    public TicketServiceImpl(TicketRepository ticketRepository, SimpMessagingTemplate messagingTemplate, 
                           NotificationRepository notificationRepository, EmailService emailService
                           ,UserService userService) {
        this.ticketRepository = ticketRepository;
        this.messagingTemplate = messagingTemplate;
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
        this.userService = userService;
    }

    @Override
    public Ticket createTicket(Ticket ticket) {
        Ticket createdTicket = ticketRepository.save(ticket);
        if (Objects.nonNull(createdTicket)) {
            Notification notification = new Notification();
            notification.setMessage("✅ New ticket: " + ticket.getTitle());
            notification.setType(NotificationType.NEW_TICKET);
            notification.setRecipient(createdTicket.getCreatedBy());
            notification.setDateSent(createdTicket.getCreationDate());
            notificationRepository.save(notification);
            User createdBy = userService.getUserById(ticket.getCreatedBy().getId());
            createdTicket.setCreatedBy(createdBy);
            emailService.sendTicketCreatedNotification(createdTicket);
            messagingTemplate.convertAndSend("/topic/notifications", notification);
        }
        return createdTicket;
    }

    @Override
    public Ticket updateTicket(Long id, Ticket ticket) {
        Ticket existingTicket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
        Ticket previousTicket = new Ticket();
        BeanUtils.copyProperties(existingTicket, previousTicket);
        
        existingTicket.setTitle(ticket.getTitle());
        existingTicket.setDescription(ticket.getDescription());
        existingTicket.setStatus(ticket.getStatus());

        if (Objects.nonNull(existingTicket)) {
            Notification notification = new Notification();
            notification.setMessage("✅ Ticket updated: " + ticket.getTitle());
            notification.setType(NotificationType.UPDATE_TICKET);
            notification.setRecipient(existingTicket.getCreatedBy());
            notification.setDateSent(existingTicket.getCreationDate());
            notificationRepository.save(notification);
            User createdBy = userService.getUserById(ticket.getCreatedBy().getId());
            existingTicket.setCreatedBy(createdBy);
            previousTicket.setCreatedBy(createdBy);
            emailService.sendTicketUpdatedNotification(existingTicket, previousTicket);
            messagingTemplate.convertAndSend("/topic/notifications", notification);
        }
        return ticketRepository.save(existingTicket);
    }

    @Override
    public void deleteTicket(Long id) {
        ticketRepository.deleteById(id);
    }

    @Override
    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
    }

    @Override
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // New pagination methods
    @Override
    public PaginatedResponse<Ticket> getAllTickets(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : 
                   Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Ticket> ticketPage = ticketRepository.findAll(pageable);
        
        return mapToCustomPagedResponse(ticketPage);
    }

    @Override
    public PaginatedResponse<Ticket> getTicketsByStatus(TicketStatus status, int page, int size, 
                                                       String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : 
                   Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Ticket> ticketPage = ticketRepository.findByStatus(status, pageable);
        
        return mapToCustomPagedResponse(ticketPage);
    }

    @Override
    public PaginatedResponse<Ticket> searchTickets(String keyword, int page, int size, 
                                                  String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : 
                   Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Ticket> ticketPage = ticketRepository.findByKeyword(keyword, pageable);
        
        return mapToCustomPagedResponse(ticketPage);
    }

    @Override
    public Page<Ticket> getTicketsPage(Pageable pageable) {
        return ticketRepository.findAll(pageable);
    }

    // Helper method to convert Spring Page to custom PaginatedResponse
    private PaginatedResponse<Ticket> mapToCustomPagedResponse(Page<Ticket> page) {
        return new PaginatedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast(),
                page.isEmpty()
        );
    }
}