package com.agence.ticket_support.dto;

import java.util.Map;
import java.util.List;
import com.agence.ticket_support.Enum.TicketStatus;

public class DashboardDTO {
    private Long totalUsers;
    private Long resolvedTickets;
    private Map<TicketStatus, Long> ticketsByStatus;
    private List<MonthlyTicketStats> ticketsCreatedByMonth;
    private List<MonthlyTicketStats> ticketsResolvedByMonth;

    // Constructors
    public DashboardDTO() {}

    public DashboardDTO(Long totalUsers, Long resolvedTickets, 
                       Map<TicketStatus, Long> ticketsByStatus,
                       List<MonthlyTicketStats> ticketsCreatedByMonth,
                       List<MonthlyTicketStats> ticketsResolvedByMonth) {
        this.totalUsers = totalUsers;
        this.resolvedTickets = resolvedTickets;
        this.ticketsByStatus = ticketsByStatus;
        this.ticketsCreatedByMonth = ticketsCreatedByMonth;
        this.ticketsResolvedByMonth = ticketsResolvedByMonth;
    }

    // Getters and Setters
    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }

    public Long getResolvedTickets() { return resolvedTickets; }
    public void setResolvedTickets(Long resolvedTickets) { this.resolvedTickets = resolvedTickets; }

    public Map<TicketStatus, Long> getTicketsByStatus() { return ticketsByStatus; }
    public void setTicketsByStatus(Map<TicketStatus, Long> ticketsByStatus) { this.ticketsByStatus = ticketsByStatus; }

    public List<MonthlyTicketStats> getTicketsCreatedByMonth() { return ticketsCreatedByMonth; }
    public void setTicketsCreatedByMonth(List<MonthlyTicketStats> ticketsCreatedByMonth) { 
        this.ticketsCreatedByMonth = ticketsCreatedByMonth; 
    }

    public List<MonthlyTicketStats> getTicketsResolvedByMonth() { return ticketsResolvedByMonth; }
    public void setTicketsResolvedByMonth(List<MonthlyTicketStats> ticketsResolvedByMonth) { 
        this.ticketsResolvedByMonth = ticketsResolvedByMonth; 
    }
}

