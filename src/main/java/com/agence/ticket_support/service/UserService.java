package com.agence.ticket_support.service;

import java.util.List;

import com.agence.ticket_support.model.User;

public interface UserService {
	
	public User createUser(User user);

	public User updateUser(Long id, User user);

	public void deleteUser(Long id);

	public User getUserById(Long id);

	public List<User> getAllUsers();
}
