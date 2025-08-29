import { Prisma, User } from '@prisma/client';
import * as userRepository from '../repositories/user.repository';

export const getUsers = async (page: number, limit: number): Promise<{ users: User[], total: number }> => {
  return userRepository.findUsers(page, limit);
};

export const createUser = async (data: Prisma.UserCreateInput): Promise<User> => {
  return userRepository.createUser(data);
};

export const updateUser = async (id: string, data: Prisma.UserUpdateInput): Promise<User> => { // Changed id to string
  return userRepository.updateUser(id, data);
};