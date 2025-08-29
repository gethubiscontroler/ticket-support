package com.agence.ticket_support.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

import com.agence.ticket_support.model.Ticket;
import com.agence.ticket_support.Enum.TicketStatus;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
    // Pagination methods (automatically inherited from JpaRepository)
    Page<Ticket> findAll(Pageable pageable);
    
    // Find tickets by status with pagination
    Page<Ticket> findByStatus(TicketStatus status, Pageable pageable);
    
    // Find tickets by title containing keyword with pagination
    Page<Ticket> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    // Find tickets by created by user with pagination
    Page<Ticket> findByCreatedBy(String createdBy, Pageable pageable);
    
    // Custom query with pagination
    @Query("SELECT t FROM Ticket t WHERE t.title LIKE %:keyword% OR t.Description LIKE %:keyword%")
    Page<Ticket> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    // Count tickets by specific status
    Long countByStatus(TicketStatus status);

    // Get count of tickets grouped by status
    @Query("SELECT t.status, COUNT(t) FROM Ticket t GROUP BY t.status")
    List<Object[]> countTicketsByStatus();

    // Get count of tickets created by month
    @Query("SELECT DATE_FORMAT(t.creationDate, '%Y-%m') as month, COUNT(t) " +
           "FROM Ticket t " +
           "GROUP BY DATE_FORMAT(t.creationDate, '%Y-%m') " +
           "ORDER BY month DESC")
    List<Object[]> countTicketsCreatedByMonth();

    // Get count of resolved tickets by month (based on creation date of resolved tickets)
    @Query("SELECT DATE_FORMAT(t.creationDate, '%Y-%m') as month, COUNT(t) " +
           "FROM Ticket t " +
           "WHERE t.status = :status " +
           "GROUP BY DATE_FORMAT(t.creationDate, '%Y-%m') " +
           "ORDER BY month DESC")
    List<Object[]> countTicketsResolvedByMonth(@Param("status") TicketStatus status);
}