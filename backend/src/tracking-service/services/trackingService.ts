import prisma from "../../shared/config/db";

export const getBookingHistory = async (ref_id: string) => {
  const booking = await prisma.booking.findUnique({
    where: { ref_id },
    include: {
      events: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!booking) throw new Error("Booking not found");

  return {
    ref_id: booking.ref_id,
    origin: booking.origin,
    destination: booking.destination,
    status: booking.status,
    timeline: booking.events,
  };
};
