import { PrismaClient, Booking, BookingEvent, Prisma, BookingStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const createBooking = async (data: Prisma.BookingCreateInput): Promise<Booking> => {
  return prisma.booking.create({ data });
};

export const findBookingByRefId = async (refId: string): Promise<Booking | null> => {
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

export const updateBookingStatus = async (refId: string, status: BookingStatus): Promise<Booking> => {
  return prisma.booking.update({
    where: { refId },
    data: { status },
  });
};

export const addBookingEvent = async (
  bookingId: number,
  eventType: BookingStatus,
  location: string,
  details: any
): Promise<BookingEvent> => {
  return prisma.bookingEvent.create({
    data: {
      bookingId,
      eventType,
      location,
      details,
    },
  });
};

export const findBookings = async (page: number, limit: number, awb?: string): Promise<{ bookings: Booking[], total: number }> => {
  const skip = (page - 1) * limit;
  const where: Prisma.BookingWhereInput = awb ? { refId: { contains: awb, mode: 'insensitive' } } : {};

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

export const findBookingsByCustomerId = async (customerId: number): Promise<Booking[]> => {
    return prisma.booking.findMany({
        where: { customerId: customerId.toString() },
        orderBy: { createdAt: 'desc' },
    });
};