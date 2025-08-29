import { PrismaClient, Flight, Prisma } from '@prisma/client';

const standalonePrisma = new PrismaClient();

const getClient = (tx?: PrismaClient | Prisma.TransactionClient) => tx || standalonePrisma;

export const findDirectFlights = async (
  origin: string,
  destination: string,
  departureDate: Date,
  tx?: PrismaClient | Prisma.TransactionClient
): Promise<Flight[]> => {
  const endOfDay = new Date(departureDate);
  endOfDay.setHours(23, 59, 59, 999);

  return getClient(tx).flight.findMany({
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

export const findFlightsByOriginAndDate = async (
  origin: string,
  departureDate: Date,
  tx?: PrismaClient | Prisma.TransactionClient
): Promise<Flight[]> => {
  const nextDay = new Date(departureDate);
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(23, 59, 59, 999);

  return getClient(tx).flight.findMany({
    where: {
      originAirportCode: origin,
      departureDatetime: {
        gte: departureDate,
        lte: nextDay,
      },
    },
  });
};

export const findFlightById = async (
  id: number,
  tx?: PrismaClient | Prisma.TransactionClient
): Promise<Flight | null> => {
  return getClient(tx).flight.findUnique({ where: { id } });
};

//flight with capacity-related fields
export const getFlightWithCapacity = async (
  flightId: number,
  tx?: PrismaClient | Prisma.TransactionClient
): Promise<Flight | null> => {
  return getClient(tx).flight.findUnique({
    where: { id: flightId },
    select: {
      id: true,
      flightNumber: true,
      airlineName: true,
      awbPrefix: true,
      originAirportCode: true,
      destinationAirportCode: true,
      departureDatetime: true,
      arrivalDatetime: true,
      maxCapacityWeightKg: true,
      maxCapacityPieces: true,
      overbookingPercentage: true,
      currentBookedWeightKg: true,
      currentBookedPieces: true,
    },
  });
};

// ]update a flight's booked capacity
export const updateFlightBookedCapacity = async (
  flightId: number,
  weightChange: number, 
  piecesChange: number, 
  tx?: PrismaClient | Prisma.TransactionClient
): Promise<Flight> => {
  return getClient(tx).flight.update({
    where: { id: flightId },
    data: {
      currentBookedWeightKg: { increment: weightChange },
      currentBookedPieces: { increment: piecesChange },
    },
  });
};

export const findFlights = async (page: number, limit: number): Promise<{ flights: Flight[], total: number }> => {
  const skip = (page - 1) * limit;
  const [flights, total] = await standalonePrisma.$transaction([
    standalonePrisma.flight.findMany({
      skip,
      take: limit,
      orderBy: { departureDatetime: 'desc' },
    }),
    standalonePrisma.flight.count(),
  ]);
  return { flights, total };
};

export const createFlight = async (data: Prisma.FlightCreateInput): Promise<Flight> => {
  // default capacity values are set if not provided
  const createData: Prisma.FlightCreateInput = {
    ...data,
    currentBookedWeightKg: data.currentBookedWeightKg ?? 0,
    currentBookedPieces: data.currentBookedPieces ?? 0,
    maxCapacityWeightKg: data.maxCapacityWeightKg ?? 0,
    maxCapacityPieces: data.maxCapacityPieces ?? 0,
    overbookingPercentage: data.overbookingPercentage ?? 0.0,
  };
  return standalonePrisma.flight.create({ data: createData });
};

export const updateFlight = async (id: number, data: Prisma.FlightUpdateInput): Promise<Flight> => {
  return standalonePrisma.flight.update({ where: { id }, data });
};
