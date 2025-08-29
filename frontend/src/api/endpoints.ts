export const API_ENDPOINTS = {
  // Ticket endpoints
  TICKETS: '/tickets',
  TICKET_BY_ID: (id: number) => `/tickets/${id}`,
  
  // User endpoints
  USERS: '/users',
  USER_BY_ID: (id: number) => `/users/${id}`,
  
  // Team endpoints
  TEAMS: '/teams',
  TEAM_BY_ID: (id: number) => `/teams/${id}`,

  // Notification endpoints
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_BY_ID: (id: number) => `/notifications/${id}`,
  
  // Auth endpoints
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
} as const;