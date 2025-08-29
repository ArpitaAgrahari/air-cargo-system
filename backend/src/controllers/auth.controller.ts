import { Request, Response } from 'express';
import { ApiResponse } from '../types/api.types';
import { auth } from '../auth/auth'; 
import { PrismaClient } from '@prisma/client';
import { validateRegisterRequest } from '../validators/user.validator';
import * as userRepository from '../repositories/user.repository';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    validateRegisterRequest(req.body);

    const registrationResult = await auth.api.signUpEmail({ body: { name, email, password } });

    const user = await userRepository.createUser({
      name,
      email,
      role,
    });

    const response: ApiResponse<any> = {
      success: true,
      message: 'User registered successfully.',
      data: { user }, 
      errors: null,
    };
    res.status(201).json(response);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: 'Registration failed.',
      data: null,
      errors: { details: { message: error.message } },
    };
    if (error.message.includes('unique constraint') || error.message.includes('duplicate key')) {
      return res.status(409).json({ ...response, message: 'User with this email already exists.' });
    }
    res.status(422).json(response);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const loginResult = await auth.api.signInEmail({ body: { email, password } });
    
    const token = loginResult.token;

    const response: ApiResponse<any> = {
      success: true,
      message: 'Login successful.',
      data: { token },
      errors: null,
    };
    res.status(200).json(response);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: 'Login failed. Invalid credentials.',
      data: null,
      errors: { details: { message: error.message || 'Login failed.' } },
    };
    res.status(401).json(response);
  }
};