import { PrismaClient, Flight, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const findDirectFlights = async (origin: string, destination: string, departureDate: Date): Promise<Flight[]> => {
  const endOfDay = new Date(departureDate);
  endOfDay.setHours(23, 59, 59, 999);

  return prisma.flight.findMany({
    where: {
      originAirportCode: origin,
      destinationAirportCode: destination,
      departureDatetime: {
        gte: departureDate,
        lte: endOfDay,
      },
    },
  });
};

export const findFlightsByOriginAndDate = async (origin: string, departureDate: Date): Promise<Flight[]> => {
  const nextDay = new Date(departureDate);
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(23, 59, 59, 999);

  return prisma.flight.findMany({
    where: {
      originAirportCode: origin,
      departureDatetime: {
        gte: departureDate,
        lte: nextDay,
      },
    },
  });
};

export const findFlightById = async (id: number): Promise<Flight | null> => {
    return prisma.flight.findUnique({ where: { id } });
};

export const findFlights = async (page: number, limit: number): Promise<{ flights: Flight[], total: number }> => {
  const skip = (page - 1) * limit;
  const [flights, total] = await prisma.$transaction([
    prisma.flight.findMany({
      skip,
      take: limit,
      orderBy: { departureDatetime: 'desc' },
    }),
    prisma.flight.count(),
  ]);
  return { flights, total };
};

export const createFlight = async (data: Prisma.FlightCreateInput): Promise<Flight> => {
  return prisma.flight.create({ data });
};

export const updateFlight = async (id: number, data: Prisma.FlightUpdateInput): Promise<Flight> => {
  return prisma.flight.update({ where: { id }, data });
};