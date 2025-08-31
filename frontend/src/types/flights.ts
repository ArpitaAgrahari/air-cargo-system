export interface Flight {
    id: number;
    flightNumber: string;
    airlineName: string;
    awbPrefix: string;
    originAirportCode: string;
    destinationAirportCode: string;
    departureDatetime: string;
    arrivalDatetime: string;
    currentBookedWeightKg: number;
    currentBookedPieces: number;
    maxCapacityWeightKg: number;
    maxCapacityPieces: number;
    overbookingPercentage: number;
    createdAt: string;
    updatedAt: string;
  }