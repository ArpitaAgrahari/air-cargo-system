import * as flightRepository from '../repositories/flight.repository';

export const getFlights = async (page: number, limit: number): Promise<{ flights: any[], total: number }> => {
  return flightRepository.findFlights(page, limit);
};

export const createFlight = async (data: any): Promise<any> => {
  return flightRepository.createFlight(data);
};

export const updateFlight = async (id: number, data: any): Promise<any> => {
  return flightRepository.updateFlight(id, data);
};