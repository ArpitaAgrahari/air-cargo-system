import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;

export const createBooking = async (data: any): Promise<any> => {
  return prisma.booking.create({ data });
};

export const findBookingByAwbNo = async (awbNo: string): Promise<any | null> => {
  return prisma.booking.findFirst({
    where: { awbNo },
    include: {
      customer: true,
      flight: true,
      events: {
        orderBy: { timestamp: 'asc' },
      },
    },
  });
};

export const updateBookingStatus = async (awbNo: string, status: string): Promise<any> => {
  return prisma.booking.findFirst({
    where: { awbNo },
  }).then((booking: any) => {
    if (!booking) throw new Error('Booking not found');
    return prisma.booking.update({
      where: { id: booking.id },
      data: { status },
    });
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
      timestamp: new Date(),
      details,
    },
  });
};

export const findBookings = async (page: number, limit: number, awb?: string): Promise<{ bookings: any[], total: number }> => {
  const skip = (page - 1) * limit;
  const where: any = awb ? { awbNo: { contains: awb, mode: 'insensitive' } } : {};

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