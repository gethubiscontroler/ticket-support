import { DashboardData } from '../../types/dashboard';
import apiClient from '../client';

export const DashboardService = {
  async getDashboardStats(): Promise<DashboardData> {
    try {
      const response = await apiClient.get<DashboardData>('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
};