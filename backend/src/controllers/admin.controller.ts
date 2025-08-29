import { Request, Response } from 'express';
import { ApiResponse, PaginatedApiResponse } from '../types/api.types';
import { Flight, Prisma, UserRole } from '@prisma/client';
import * as flightRepository from '../repositories/flight.repository';
import * as userRepository from '../repositories/user.repository';

export const getFlights = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const { flights, total } = await flightRepository.findFlights(page, limit);
        const totalPages = Math.ceil(total / limit);

        const response: PaginatedApiResponse<Flight> = {
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
        const { flight_number, airline_name, origin_airport_code, destination_airport_code, departure_datetime, arrival_datetime } = req.body;

        const newFlight = await flightRepository.createFlight({
            flightNumber: flight_number,
            airlineName: airline_name,
            originAirportCode: origin_airport_code,
            destinationAirportCode: destination_airport_code,
            departureDatetime: new Date(departure_datetime),
            arrivalDatetime: new Date(arrival_datetime),
        });

        const response: ApiResponse<Flight> = {
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
        const updatedData: Prisma.FlightUpdateInput = req.body;

        const updatedFlight = await flightRepository.updateFlight(flightId, updatedData);

        const response: ApiResponse<Flight> = {
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
        const { name, email, role, password } = req.body;

        const newUser = await userRepository.createUser({
            name,
            email,
            role
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
        const userId = req.params.userId;
        const updatedData: Prisma.UserUpdateInput = req.body;

        const updatedUser = await userRepository.updateUser(userId, updatedData);

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