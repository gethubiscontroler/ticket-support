package com.agence.ticket_support.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.agence.ticket_support.dao.NotificationRepository;
import com.agence.ticket_support.model.Notification;
import com.agence.ticket_support.service.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService{
	
	private final NotificationRepository notificationRepository;

	public NotificationServiceImpl(NotificationRepository notificationRepository) {
		this.notificationRepository = notificationRepository;
	}

	@Override
	public Notification createNotification(Notification notification) {
		return notificationRepository.save(notification);
	}

	@Override
	public Notification updateNotification(Long id, Notification notification) {
		Notification existingNotification = notificationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Notification non trouvé"));
		existingNotification.setDateSent(notification.getDateSent());
		existingNotification.setMessage(notification.getMessage());
		existingNotification.setReaded(notification.getReaded());
		existingNotification.setRecipient(notification.getRecipient());
		return notificationRepository.save(existingNotification);
	}

	@Override
	public void deleteNotification(Long id) {
		notificationRepository.deleteById(id);
	}

	@Override
	public Notification getNotificationById(Long id) {
		return notificationRepository.findById(id).orElseThrow(() -> new RuntimeException("Notification non trouvé"));
	}

	@Override
	public List<Notification> getAllNotifications() {
		return notificationRepository.findAll();
	}

}
