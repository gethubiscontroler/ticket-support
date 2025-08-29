import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { ApiResponse, PaginatedResponse } from '../../types/api';
import { CreateUserRequest, User } from '../../model/user';

export class UserService {
  // Get all tickets with optional pagination
  static async getUsers(page = 0, size = 10): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>(
      `${API_ENDPOINTS.USERS}?page=${page}&size=${size}`
    );
    return response.data;
  }

  // Get single ticket by ID
  static async getUserById(id: number): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.USER_BY_ID(id)
    );
    return response.data.data;
  }

  // Create new ticket
  static async createUser(ticket: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(
      API_ENDPOINTS.USERS,
      ticket
    );
    return response.data.data;
  }

  // Update existing ticket
  static async updateUser(id: number, ticket: CreateUserRequest): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.USER_BY_ID(id),
      ticket
    );
    return response.data.data;
  }

  // Delete ticket
  static async deleteUser(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.USER_BY_ID(id));
  }

  // Search tickets
  static async searchUsers(query: string): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>(
      `${API_ENDPOINTS.USERS}/search?q=${encodeURIComponent(query)}`
    );
    return response.data.data;
  }
}
