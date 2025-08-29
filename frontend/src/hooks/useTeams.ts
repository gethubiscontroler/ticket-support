import { useState, useCallback, useEffect } from 'react';
import { useApi } from './useApi';
import { CreateTeamRequest, Team } from '../model/team';
import { TeamService } from '../api/services/teamService';

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Get all tickets
  const {
    data: teamsData,
    loading: teamsLoading,
    error: teamsError,
    refetch: refetchTeams
  } = useApi(() => TeamService.getTickets(), { immediate: true });

  useEffect(() => {
    if (teamsData) {
      setTeams(teamsData);
    }
  }, [teamsData]);

  // Create ticket
  const createTeam = useCallback(async (teamData: CreateTeamRequest) => {
    try {
      const newTicket = await TeamService.createTeam(teamData);
      setTeams(prev => [...prev, newTicket]);
      return newTicket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }, []);

  // Update ticket
  const updateTeam = useCallback(async (id: number, ticketData: CreateTeamRequest) => {
    try {
      const updatedTeam = await TeamService.updateTicket(id, ticketData);
      setTeams(prev => prev.map(t => t.id === id ? updatedTeam : t));
      return updatedTeam;
    } catch (error) {
      console.error('Error updating team:', error);
      throw error;
    }
  }, []);

  // Delete ticket
  const deleteTeam = useCallback(async (id: number) => {
    try {
      await TeamService.deleteTicket(id);
      setTeams(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting team:', error);
      throw error;
    }
  }, []);

  // Get single ticket
  const getTeam = useCallback(async (id: number) => {
    try {
      const team = await TeamService.getTicketById(id);
      setSelectedTeam(team);
      return team;
    } catch (error) {
      console.error('Error fetching team:', error);
      throw error;
    }
  }, []);

  return {
    teams: teamsData?.data || teams,
    selectedTeam,
    loading: teamsLoading,
    error: teamsError,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeam,
    refetchTeams,
  };
}