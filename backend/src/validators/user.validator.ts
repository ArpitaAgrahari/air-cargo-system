import { UserRole } from '@prisma/client';
import { validateString, validateEmail } from './common.validator';

export const validateRegisterRequest = (body: any) => {
  validateString(body.name, 'name');
  validateEmail(body.email);
  validateString(body.password, 'password');

  if (body.role && !Object.values(UserRole).includes(body.role)) {
    throw new Error('Invalid user role.');
  }
};