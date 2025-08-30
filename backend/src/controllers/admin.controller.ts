import { Request, Response } from 'express';
import { ApiResponse, PaginatedApiResponse } from '../types/api.types';
import { Prisma } from '@prisma/client';
import * as flightRepository from '../repositories/flight.repository';
import * as userRepository from '../repositories/user.repository';
import { validateAddFlightRequest, validateUpdateFlightRequest } from '../validators/flight.validator'; 

export const getFlights = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const { flights, total } = await flightRepository.findFlights(page, limit);
        const totalPages = Math.ceil(total / limit);
        
        const response: PaginatedApiResponse<any> = {
            success: true,
            message: 'Flights fetched successfully.',
            data: flights,
            errors: null,
            pagination: { totalItems: total, totalPages, currentPage: page, pageSize: limit },
        };
        res.status(200).json(response);
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Failed to fetch flights', errors: { details: { message: error.message } } });
    }
};

export const addFlight = async (req: Request, res: Response) => {
    try {
        validateAddFlightRequest(req.body); 
        const {
            flightNumber,
            airlineName,
            awbPrefix,
            originAirportCode,
            destinationAirportCode,
            departureDatetime,
            arrivalDatetime,
            maxCapacityWeightKg, 
            maxCapacityPieces,   
            overbookingPercentage, 
        } = req.body;
        
        const newFlight = await flightRepository.createFlight({
            flightNumber,
            airlineName,
            awbPrefix,
            originAirportCode,
            destinationAirportCode,
            departureDatetime: new Date(departureDatetime),
            arrivalDatetime: new Date(arrivalDatetime),
            maxCapacityWeightKg,
            maxCapacityPieces,
            overbookingPercentage,
        });
        
        const response: ApiResponse<any> = {
            success: true,
            message: 'Flight added successfully.',
            data: newFlight,
            errors: null,
        };
        res.status(201).json(response);
    } catch (error: any) {
        res.status(422).json({ success: false, message: 'Failed to add flight', errors: { details: { message: error.message } } });
    }
};

export const updateFlight = async (req: Request, res: Response) => {
    try {
        const flightId = parseInt(req.params.flightId);
        validateUpdateFlightRequest(req.body);
        const updatedData: any = req.body;
        
        const updatedFlight = await flightRepository.updateFlight(flightId, updatedData);
        
        const response: ApiResponse<any> = {
            success: true,
            message: 'Flight updated successfully.',
            data: updatedFlight,
            errors: null,
        };
        res.status(200).json(response);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ success: false, message: 'Flight not found.', errors: { details: { message: error.message } } });
        }
        res.status(422).json({ success: false, message: 'Failed to update flight', errors: { details: { message: error.message } } });
    }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const { users, total } = await userRepository.findUsers(page, limit);
    const totalPages = Math.ceil(total / limit);
    
    const response: PaginatedApiResponse<any> = {
        success: true,
        message: 'Users fetched successfully.',
        data: users,
        errors: null,
        pagination: { totalItems: total, totalPages, currentPage: page, pageSize: limit },
    };
    res.status(200).json(response);
  } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch users', errors: { details: { message: error.message } } });
  }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, role } = req.body;
        const id = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const createdAt = new Date();
        const updatedAt = createdAt;
        
        const newUser = await userRepository.createUser({
            id,
            name,
            email,
            role,
            emailVerified: false,
            createdAt,
            updatedAt,
        });

        const response: ApiResponse<any> = {
            success: true,
            message: 'User created successfully.',
            data: newUser,
            errors: null,
        };
        res.status(201).json(response);
    } catch (error: any) {
        res.status(422).json({ success: false, message: 'Failed to create user', errors: { details: { message: error.message } } });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const updatedData: Prisma.UserUpdateInput = req.body;
        
        const updatedUser = await userRepository.updateUser(userId.toString(), updatedData);
        
        const response: ApiResponse<any> = {
            success: true,
            message: 'User updated successfully.',
            data: updatedUser,
            errors: null,
        };
        res.status(200).json(response);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ success: false, message: 'User not found.', errors: { details: { message: error.message } } });
        }
        res.status(422).json({ success: false, message: 'Failed to update user', errors: { details: { message: error.message } } });
    }
};
