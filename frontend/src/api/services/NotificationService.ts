import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { ApiResponse, PaginatedResponse } from '../../types/api';
import { Notification } from '../../model/notification';

export class NotificationService {
  // Get all tickets with optional pagination
  static async getNotifications(page = 0, size = 10): Promise<PaginatedResponse<Notification>> {
    const response = await apiClient.get<PaginatedResponse<Notification>>(
      `${API_ENDPOINTS.NOTIFICATIONS}?page=${page}&size=${size}`
    );
    return response.data;
  }

  // Get single ticket by ID
  static async getNotificationById(id: number): Promise<Notification> {
    const response = await apiClient.get<ApiResponse<Notification>>(
      API_ENDPOINTS.NOTIFICATION_BY_ID(id)
    );
    return response.data.data;
  }



  // Search tickets
  static async searchNotifications(query: string): Promise<Notification[]> {
    const response = await apiClient.get<ApiResponse<Notification[]>>(
      `${API_ENDPOINTS.NOTIFICATIONS}/search?q=${encodeURIComponent(query)}`
    );
    return response.data.data;
  }
}
