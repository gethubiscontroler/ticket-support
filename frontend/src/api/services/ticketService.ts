import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { Ticket, CreateTicketRequest } from '../../model/ticket';
import { ApiResponse, PaginatedResponse } from '../../types/api';

export class TicketService {
  // Get all tickets with optional pagination
  static async getTickets(page = 0, size = 10): Promise<PaginatedResponse<Ticket>> {
    const response = await apiClient.get<PaginatedResponse<Ticket>>(
      `${API_ENDPOINTS.TICKETS}?page=${page}&size=${size}`
    );
    return response.data;
  }

  // Get single ticket by ID
  static async getTicketById(id: number): Promise<Ticket> {
    const response = await apiClient.get<ApiResponse<Ticket>>(
      API_ENDPOINTS.TICKET_BY_ID(id)
    );
    return response.data.data;
  }

  // Create new ticket
  static async createTicket(ticket: CreateTicketRequest): Promise<any> {
    const response = await apiClient.post<ApiResponse<Ticket>>(
      API_ENDPOINTS.TICKETS,
      ticket
    );
    return response.data;
  }

  // Update existing ticket
  static async updateTicket(id: number, ticket: CreateTicketRequest): Promise<any> {
    const response = await apiClient.put<ApiResponse<Ticket>>(
      API_ENDPOINTS.TICKET_BY_ID(id),
      ticket
    );
    return response.data;
  }

  // Delete ticket
  static async deleteTicket(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.TICKET_BY_ID(id));
  }

  // Search tickets
  static async searchTickets(query: string): Promise<Ticket[]> {
    const response = await apiClient.get<ApiResponse<Ticket[]>>(
      `${API_ENDPOINTS.TICKETS}/search?q=${encodeURIComponent(query)}`
    );
    return response.data.data;
  }
}
