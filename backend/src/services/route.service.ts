import { findDirectFlights, findFlightsByOriginAndDate } from '../repositories/flight.repository';

interface TransitRoute {
  leg1: any;
  leg2: any;
}

export const getAvailableRoutes = async (
  origin: string,
  destination: string,
  date: string
): Promise<{ directFlights: any[]; transitRoutes: TransitRoute[] }> => {
  const departureDate = new Date(date);

  // Get direct flights
  const directFlights = await findDirectFlights(origin, destination, departureDate);

  // Find 1-stop transit routes
  const transitRoutes: TransitRoute[] = [];

  // Find all flights departing from the origin on the given date
  const leg1Flights = await findFlightsByOriginAndDate(origin, departureDate);

  for (const leg1 of leg1Flights) {
    // The transit destination of leg1 is the origin of leg2
    const transitDestination = leg1.destinationAirportCode;

    // The second flight must depart on the same day or the next day
    const leg2DepartureDate = new Date(leg1.arrivalDatetime);

    const leg2Flights = await findDirectFlights(transitDestination, destination, leg2DepartureDate);

    for (const leg2 of leg2Flights) {
      // Check if the layover is reasonable (e.g., within 24 hours)
      const arrivalLeg1 = new Date(leg1.arrivalDatetime);
      const departureLeg2 = new Date(leg2.departureDatetime);
      const layoverDuration = departureLeg2.getTime() - arrivalLeg1.getTime();

      // A simplified check: ensure leg2 is not before leg1 arrival and is on the same/next day
      if (layoverDuration >= 0 && layoverDuration <= 24 * 60 * 60 * 1000) {
        transitRoutes.push({ leg1, leg2 });
      }
    }
  }

  return { directFlights, transitRoutes };
};