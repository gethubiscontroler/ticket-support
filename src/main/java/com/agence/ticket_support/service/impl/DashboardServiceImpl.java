package com.agence.ticket_support.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.agence.ticket_support.Enum.TicketStatus;
import com.agence.ticket_support.dao.TicketRepository;
import com.agence.ticket_support.dao.UserRepository;
import com.agence.ticket_support.dto.DashboardDTO;
import com.agence.ticket_support.dto.MonthlyTicketStats;
import com.agence.ticket_support.service.DashboardService;

@Service
public class DashboardServiceImpl implements DashboardService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private TicketRepository ticketRepository;

	@Override
	public DashboardDTO getDashboardData() {
		// Get total users count
		Long totalUsers = userRepository.count();

		// Get resolved tickets count
		Long resolvedTickets = ticketRepository.countByStatus(TicketStatus.RESOLU);

		// Get tickets grouped by status
		Map<TicketStatus, Long> ticketsByStatus = getTicketsByStatus();

		// Get monthly created tickets
		List<MonthlyTicketStats> ticketsCreatedByMonth = getTicketsCreatedByMonth();

		// Get monthly resolved tickets (based on creation date for resolved tickets)
		List<MonthlyTicketStats> ticketsResolvedByMonth = getTicketsResolvedByMonth();

		return new DashboardDTO(totalUsers, resolvedTickets, ticketsByStatus, ticketsCreatedByMonth,
				ticketsResolvedByMonth);
	}

	private Map<TicketStatus, Long> getTicketsByStatus() {
		List<Object[]> results = ticketRepository.countTicketsByStatus();
		return results.stream().collect(Collectors.toMap(result -> (TicketStatus) result[0], // status enum
				result -> (Long) result[1] // count
		));
	}

	private List<MonthlyTicketStats> getTicketsCreatedByMonth() {
		List<Object[]> results = ticketRepository.countTicketsCreatedByMonth();
		return results.stream().map(result -> new MonthlyTicketStats((String) result[0], // month
				(Long) result[1] // count
		)).collect(Collectors.toList());
	}

	private List<MonthlyTicketStats> getTicketsResolvedByMonth() {
		List<Object[]> results = ticketRepository.countTicketsResolvedByMonth(TicketStatus.RESOLU);
		return results.stream().map(result -> new MonthlyTicketStats((String) result[0], // month
				(Long) result[1] // count
		)).collect(Collectors.toList());
	}
}
