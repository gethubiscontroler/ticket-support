import { useState, useCallback, useEffect } from 'react';
import { useApi } from './useApi';
import { CreateUserRequest, User } from '../model/user';
import { UserService } from '../api/services/userService';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Get all tickets
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    refetch: refetchTickets
  } = useApi(() => UserService.getUsers(), { immediate: true });

  useEffect(() => {
    if (usersData) {
      setUsers(usersData);
    }
  }, [usersData]);

  // Create ticket
  const createUser = useCallback(async (userData: CreateUserRequest) => {
    try {
      const newTicket = await UserService.createUser(userData);
      setUsers(prev => [...prev, newTicket]);
      return newTicket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }, []);

  // Update ticket
  const updateUser = useCallback(async (id: number, userData: CreateUserRequest) => {
    try {
      const updatedUser = await UserService.updateUser(id, userData);
      setUsers(prev => prev.map(t => t.id === id ? updatedUser : t));
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }, []);

  // Delete ticket
  const deleteUser = useCallback(async (id: number) => {
    try {
      await UserService.deleteUser(id);
      setUsers(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }, []);

  // Get single ticket
  const getUser = useCallback(async (id: number) => {
    try {
      const user = await UserService.getUserById(id);
      setSelectedUser(user);
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }, []);

  return {
    users: usersData?.data || users,
    selectedUser,
    loading: usersLoading,
    error: usersError,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    refetchTickets,
  };
}