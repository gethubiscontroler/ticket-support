import { useState, useCallback, useContext, useEffect } from 'react';
import { DashboardService } from '../api/services/dashboardService';
import { DashboardData } from '../types/dashboard';
import { useApi } from './useApi';
import { DashboardContext } from '../context/dashboard-context';

export function useDashboard() {
  const { state, dispatch } = useContext(DashboardContext);

  // Using your existing useApi pattern
  const { 
    data: dashboardData, 
    loading, 
    error, 
    refetch: refetchDashboard 
  } = useApi(() => DashboardService.getDashboardStats(), { 
    immediate: true 
  });

  // Update context when data changes
  useEffect(() => {
    if (dashboardData) {
      dispatch({ type: 'FETCH_SUCCESS', payload: dashboardData });
    }
  }, [dashboardData, dispatch]);

  useEffect(() => {
    if (loading) {
      dispatch({ type: 'FETCH_START' });
    }
  }, [loading, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error || 'Failed to fetch dashboard data' });
    }
  }, [error, dispatch]);

  // Manual refresh function
  const refreshDashboard = useCallback(async () => {
    try {
      dispatch({ type: 'FETCH_START' });
      const data = await DashboardService.getDashboardStats();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
      return data;
    } catch (error: any) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message || 'Failed to fetch dashboard data' });
      throw error;
    }
  }, [dispatch]);

  // Reset dashboard state
  const resetDashboard = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  // Computed values for easier access
  const computedStats = state.dashboardData ? {
    totalTickets: Object.values(state.dashboardData.ticketsByStatus).reduce((sum, count) => sum + count, 0),
    resolvedPercentage: state.dashboardData.totalUsers > 0 
      ? Math.round((state.dashboardData.resolvedTickets / Object.values(state.dashboardData.ticketsByStatus).reduce((sum, count) => sum + count, 0)) * 100)
      : 0,
    mostRecentMonth: state.dashboardData.ticketsCreatedByMonth[0]?.month || null,
    totalCreatedThisMonth: state.dashboardData.ticketsCreatedByMonth[0]?.count || 0,
    totalResolvedThisMonth: state.dashboardData.ticketsResolvedByMonth[0]?.count || 0,
  } : null;

  return {
    // State
    dashboardData: dashboardData,
    loading: state.loading || loading,
    error: state.error || error,
    
    // Computed stats
    computedStats,
    
    // Actions
    refreshDashboard,
    refetchDashboard,
    resetDashboard,
  };
}
