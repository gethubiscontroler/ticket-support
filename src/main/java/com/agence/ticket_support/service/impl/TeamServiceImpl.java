package com.agence.ticket_support.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.agence.ticket_support.dao.TeamRepository;
import com.agence.ticket_support.model.Team;
import com.agence.ticket_support.service.TeamService;

@Service
public class TeamServiceImpl implements TeamService {

	private final TeamRepository teamRepository;

	public TeamServiceImpl(TeamRepository teamRepository) {
		this.teamRepository = teamRepository;
	}

	@Override
	public Team createTeam(Team team) {
		return teamRepository.save(team);
	}

	@Override
	public Team updateTeam(Long id, Team team) {
		Team existingTeam = teamRepository.findById(id).orElseThrow(() -> new RuntimeException("Team non trouvé"));
		existingTeam.setName(team.getName());
		return teamRepository.save(existingTeam);
	}

	@Override
	public void deleteTeam(Long id) {
		teamRepository.deleteById(id);
	}

	@Override
	public Team getTeamById(Long id) {
		return teamRepository.findById(id).orElseThrow(() -> new RuntimeException("Team non trouvé"));
	}


	@Override
	public List<Team> getAllTeams() {
		return teamRepository.findAll();
	}

}
