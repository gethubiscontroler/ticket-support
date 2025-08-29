package com.agence.ticket_support.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.agence.ticket_support.model.Team;

public interface TeamRepository extends JpaRepository<Team, Long>{

}
