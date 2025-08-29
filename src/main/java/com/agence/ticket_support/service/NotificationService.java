package com.agence.ticket_support.service;

import java.util.List;
import com.agence.ticket_support.model.Notification;

public interface NotificationService {
	
	public Notification createNotification(Notification notification);

	public Notification updateNotification(Long id, Notification notification);

	public void deleteNotification(Long id);

	public Notification getNotificationById(Long id);

	public List<Notification> getAllNotifications();

}
