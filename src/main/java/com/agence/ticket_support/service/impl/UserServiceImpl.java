package com.agence.ticket_support.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.agence.ticket_support.dao.UserRepository;
import com.agence.ticket_support.model.User;
import com.agence.ticket_support.service.UserService;

@Service
public class UserServiceImpl implements UserService{
	
	private final UserRepository userRepository;

	public UserServiceImpl(UserRepository userRepository) {
		this.userRepository = userRepository;
	}


	@Override
	public User createUser(User user) {
		return userRepository.save(user);
	}

	@Override
	public User updateUser(Long id, User user) {
		User existingUser = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User non trouvé"));
		existingUser.setName(user.getName());
		existingUser.setEmail(user.getEmail());
		return userRepository.save(existingUser);
	}

	@Override
	public void deleteUser(Long id) {
		userRepository.deleteById(id);
	}

	@Override
	public User getUserById(Long id) {
		return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User non trouvé"));
	}

	@Override
	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

}
