package com.agence.ticket_support.controller;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.agence.ticket_support.Enum.TicketStatus;
import com.agence.ticket_support.dto.PaginatedResponse;
import com.agence.ticket_support.model.Ticket;
import com.agence.ticket_support.service.TicketService;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    
    private final TicketService ticketService;
    
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }
    
    // ✅ GET ALL TICKETS (Original - without pagination)
    @GetMapping("/all")
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }
    
    // ✅ GET ALL TICKETS WITH PAGINATION (New)
    @GetMapping
    public ResponseEntity<PaginatedResponse<Ticket>> getAllTicketsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        PaginatedResponse<Ticket> response = ticketService.getAllTickets(page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }
    
    // ✅ GET TICKETS BY STATUS WITH PAGINATION
    @GetMapping("/status/{status}")
    public ResponseEntity<PaginatedResponse<Ticket>> getTicketsByStatus(
            @PathVariable TicketStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        PaginatedResponse<Ticket> response = ticketService.getTicketsByStatus(status, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }
    
    // ✅ SEARCH TICKETS WITH PAGINATION
    @GetMapping("/search")
    public ResponseEntity<PaginatedResponse<Ticket>> searchTickets(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        PaginatedResponse<Ticket> response = ticketService.searchTickets(keyword, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }
    
    // ✅ GET TICKETS WITH SPRING PAGE (Alternative approach)
    @GetMapping("/page")
    public ResponseEntity<Page<Ticket>> getTicketsPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : 
                   Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Ticket> ticketPage = ticketService.getTicketsPage(pageable);
        
        return ResponseEntity.ok(ticketPage);
    }
    
    // ✅ GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        Ticket ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ticket);
    }
    
    // ✅ CREATE
    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) {
        Ticket createdTicket = ticketService.createTicket(ticket);
        return ResponseEntity.ok(createdTicket);
    }
    
    // ✅ UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @RequestBody Ticket ticket) {
        Ticket updatedTicket = ticketService.updateTicket(id, ticket);
        return ResponseEntity.ok(updatedTicket);
    }
    
    // ✅ DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}