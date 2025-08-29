import { useState, useCallback, useEffect } from 'react';
import { TicketService } from '../api/services/ticketService';
import { Ticket, CreateTicketRequest } from '../model/ticket';

interface PaginationParams {
  page: number;
  limit: number;
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10
  });
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tickets function
  const fetchTickets = useCallback(async (page: number, limit: number) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching tickets: page=${page}, limit=${limit}`);
      
      // Convert to 0-based for backend API
      const response = await TicketService.getTickets(page - 1, limit);
      
      console.log('Tickets response:', response);
      
      setTickets(response.content || response);
      setTotalCount(response.totalElements || response?.content?.length || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tickets';
      setError(errorMessage);
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tickets when pagination changes
  useEffect(() => {
    console.log('Pagination changed, fetching tickets...', pagination);
    fetchTickets(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit, fetchTickets]);

  // Update pagination
  const updatePagination = useCallback((newPagination: Partial<PaginationParams>) => {
    setPagination(prev => {
      const updated = { ...prev, ...newPagination };
      console.log('updatePagination:', { prev, newPagination, updated });
      return updated;
    });
  }, []);

  // Go to specific page
  const goToPage = useCallback((page: number) => {
    console.log('goToPage called:', page);
    updatePagination({ page });
  }, [updatePagination]);

  // Change page size
  const changePageSize = useCallback((limit: number) => {
    console.log('changePageSize called:', limit);
    updatePagination({ page: 1, limit }); // Reset to first page when changing page size
  }, [updatePagination]);

  // Create ticket
  const createTicket = useCallback(async (ticketData: CreateTicketRequest) => {
    try {
      const newTicket = await TicketService.createTicket(ticketData);
      
      // Go to first page to see the new ticket (assuming newest first)
      updatePagination({ page: 1 });
      
      return newTicket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }, [updatePagination]);

  // Update ticket
  const updateTicket = useCallback(async (id: number, ticketData: CreateTicketRequest) => {
    try {
      const updatedTicket = await TicketService.updateTicket(id, ticketData);
      
      // Update the ticket in current page if it exists
      setTickets(prev => prev.map(t => t.id === id ? updatedTicket : t));
      
      return updatedTicket;
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  }, []);

  // Delete ticket
  const deleteTicket = useCallback(async (id: number) => {
    try {
      await TicketService.deleteTicket(id);
      
      // Refresh current page after deletion
      await fetchTickets(pagination.page, pagination.limit);
      
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  }, [fetchTickets, pagination.page, pagination.limit]);

  // Get single ticket
  const getTicket = useCallback(async (id: number) => {
    try {
      const ticket = await TicketService.getTicketById(id);
      setSelectedTicket(ticket);
      return ticket;
    } catch (error) {
      console.error('Error fetching ticket:', error);
      throw error;
    }
  }, []);

  // Refresh current page
  const refreshTickets = useCallback(() => {
    fetchTickets(pagination.page, pagination.limit);
  }, [fetchTickets, pagination.page, pagination.limit]);

  // Manual refetch function (for compatibility)
  const refetchTickets = useCallback(() => {
    refreshTickets();
  }, [refreshTickets]);

  return {
    // Data
    tickets,
    selectedTicket,
    totalCount,
    
    // Pagination info
    currentPage: pagination.page,
    pageSize: pagination.limit,
    totalPages: Math.ceil(totalCount / pagination.limit),
    
    // Loading states
    loading,
    error,
    
    // CRUD operations
    createTicket,
    updateTicket,
    deleteTicket,
    getTicket,
    
    // Pagination controls
    goToPage,
    changePageSize,
    updatePagination,
    
    // Utilities
    refreshTickets,
    refetchTickets,
  };
}