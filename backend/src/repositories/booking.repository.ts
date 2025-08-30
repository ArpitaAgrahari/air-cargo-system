import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;

export const createBooking = async (data: any): Promise<any> => {
  return prisma.booking.create({ data });
};

export const findBookingByRefId = async (refId: string): Promise<any | null> => {
  return prisma.booking.findUnique({
    where: { refId },
    include: {
      customer: true,
      flight: true,
      events: {
        orderBy: { timestamp: 'asc' },
      },
    },
  });
};

export const updateBookingStatus = async (refId: string, status: string): Promise<any> => {
  return prisma.booking.update({
    where: { refId },
    data: { status },
  });
};

export const addBookingEvent = async (
  bookingId: number,
  eventType: string,
  location: string,
  details: any
): Promise<any> => {
  return prisma.bookingEvent.create({
    data: {
      bookingId,
      eventType,
      location,
      details,
    },
  });
};

export const findBookings = async (page: number, limit: number, awb?: string): Promise<{ bookings: any[], total: number }> => {
  const skip = (page - 1) * limit;
  const where: any = awb ? { refId: { contains: awb, mode: 'insensitive' } } : {};

  const [bookings, total] = await prisma.$transaction([
    prisma.booking.findMany({
      skip,
      take: limit,
      where,
      include: { customer: true, flight: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.booking.count({ where }),
  ]);

  return { bookings, total };
};

export const findBookingsByCustomerId = async (customerId: string): Promise<any[]> => {
    return prisma.booking.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
    });
};