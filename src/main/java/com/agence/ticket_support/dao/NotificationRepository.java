package com.agence.ticket_support.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.agence.ticket_support.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long>{

}
