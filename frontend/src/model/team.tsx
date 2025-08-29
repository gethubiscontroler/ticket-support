export interface Team {
  id: number;
  name: string;
  description?: string;
  // Add other team properties as needed
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
}
