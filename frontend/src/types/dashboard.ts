export interface MonthlyStats {
  month: string;
  count: number;
}

export interface DashboardData {
  totalUsers: number;
  resolvedTickets: number;
  ticketsByStatus: Record<string, number>;
  ticketsCreatedByMonth: MonthlyStats[];
  ticketsResolvedByMonth: MonthlyStats[];
}

export interface DashboardState {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
}

export interface DashboardAction {
  type: 'FETCH_START' | 'FETCH_SUCCESS' | 'FETCH_ERROR' | 'RESET';
  payload?: any;
}
