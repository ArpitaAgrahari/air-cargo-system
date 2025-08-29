import { Prisma, Flight } from '@prisma/client';
import * as flightRepository from '../repositories/flight.repository';

export const getFlights = async (page: number, limit: number): Promise<{ flights: Flight[], total: number }> => {
  return flightRepository.findFlights(page, limit);
};

export const createFlight = async (data: Prisma.FlightCreateInput): Promise<Flight> => {
  return flightRepository.createFlight(data);
};

export const updateFlight = async (id: number, data: Prisma.FlightUpdateInput): Promise<Flight> => {
  return flightRepository.updateFlight(id, data);
};