package com.agence.ticket_support.service;

import java.util.List;

import com.agence.ticket_support.model.Team;

public interface TeamService {
	
	public Team createTeam(Team team);

	public Team updateTeam(Long id, Team team);

	public void deleteTeam(Long id);

	public Team getTeamById(Long id);

	public List<Team> getAllTeams();

}
