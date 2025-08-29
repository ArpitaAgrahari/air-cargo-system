import { Prisma, User } from '@prisma/client';
import * as userRepository from '../repositories/user.repository';

export const getUsers = async (page: number, limit: number): Promise<{ users: User[], total: number }> => {
  return userRepository.findUsers(page, limit);
};

export const createUser = async (data: Prisma.UserCreateInput): Promise<User> => {
  return userRepository.createUser(data);
};

export const updateUser = async (id: number, data: Prisma.UserUpdateInput): Promise<User> => {
  return userRepository.updateUser(id.toString(), data);
};