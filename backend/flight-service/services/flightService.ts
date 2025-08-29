import prisma from "../../shared/config/db";


export const createFlight = async (data: {
  flightNo: string;
  origin: string;
  destination: string;
  capacity: number;
  departureAt: Date;
  arrivalAt: Date;
}) => {
  return await prisma.flight.create({ data });
};

export const getAllFlights = async () => {
  return await prisma.flight.findMany();
};

export const getFlightByNo = async (flightNo: string) => {
  return await prisma.flight.findUnique({ where: { flightNo } });
};

export const updateFlightStatus = async (flightNo: string, status: FlightStatus) => {
  return await prisma.flight.update({
    where: { flightNo },
    data: { status },
  });
};
