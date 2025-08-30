import { USER_ROLES } from '../constants';
import { validateString, validateEmail } from './common.validator';

export const validateRegisterRequest = (body: any) => {
  validateString(body.name, 'name');
  validateEmail(body.email);
  validateString(body.password, 'password');

  if (body.role && !Object.values(USER_ROLES).includes(body.role)) {
    throw new Error('Invalid user role.');
  }
};  