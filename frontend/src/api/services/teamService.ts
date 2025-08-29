import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { ApiResponse, PaginatedResponse } from '../../types/api';
import { CreateTeamRequest, Team } from '../../model/team';

export class TeamService {
  // Get all tickets with optional pagination
  static async getTickets(page = 0, size = 10): Promise<PaginatedResponse<Team>> {
    const response = await apiClient.get<PaginatedResponse<Team>>(
      `${API_ENDPOINTS.TEAMS}?page=${page}&size=${size}`
    );
    return response.data;
  }

  // Get single ticket by ID
  static async getTicketById(id: number): Promise<Team> {
    const response = await apiClient.get<ApiResponse<Team>>(
      API_ENDPOINTS.TEAM_BY_ID(id)
    );
    return response.data.data;
  }

  // Create new ticket
  static async createTeam(team: CreateTeamRequest): Promise<Team> {
    const response = await apiClient.post<ApiResponse<Team>>(
      API_ENDPOINTS.TEAMS,
      team
    );
    return response.data.data;
  }

  // Update existing ticket
  static async updateTicket(id: number, team: CreateTeamRequest): Promise<Team> {
    const response = await apiClient.put<ApiResponse<Team>>(
      API_ENDPOINTS.TEAM_BY_ID(id),
      team
    );
    return response.data.data;
  }

  // Delete ticket
  static async deleteTicket(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.TEAM_BY_ID(id));
  }

  // Search tickets
  static async searchTickets(query: string): Promise<Team[]> {
    const response = await apiClient.get<ApiResponse<Team[]>>(
      `${API_ENDPOINTS.TEAMS}/search?q=${encodeURIComponent(query)}`
    );
    return response.data.data;
  }
}
