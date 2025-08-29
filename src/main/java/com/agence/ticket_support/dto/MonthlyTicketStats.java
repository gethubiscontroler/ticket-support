package com.agence.ticket_support.dto;

public class MonthlyTicketStats {
    private String month; // Format: "2024-01"
    private Long count;

    public MonthlyTicketStats() {}

    public MonthlyTicketStats(String month, Long count) {
        this.month = month;
        this.count = count;
    }

    // Getters and Setters
    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public Long getCount() { return count; }
    public void setCount(Long count) { this.count = count; }
}
