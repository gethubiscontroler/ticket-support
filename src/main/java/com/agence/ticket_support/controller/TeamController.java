package com.agence.ticket_support.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agence.ticket_support.model.Team;
import com.agence.ticket_support.service.TeamService;


@RestController
@RequestMapping("/api/teams")
public class TeamController {

	private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }
    
    @GetMapping
    public List<Team> getAllTeams() {
        return teamService.getAllTeams();
    }

    // ✅ GET BY ID
    @GetMapping("/{id}")
    public Team getTeamById(@PathVariable Long id) {
        return teamService.getTeamById(id);
    }

    // ✅ CREATE
    @PostMapping
    public Team createTeam(@RequestBody Team team) {
        return teamService.createTeam(team);
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public Team updateTeam(@PathVariable Long id, @RequestBody Team team) {
        return teamService.updateTeam(id, team);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public void deleteTeam(@PathVariable Long id) {
    	teamService.deleteTeam(id);
    }
}
