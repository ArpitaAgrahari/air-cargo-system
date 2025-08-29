import { validateNumber, validateString } from './common.validator';

export const validateAddFlightRequest = (body: any) => {
  validateString(body.flightNumber, 'flightNumber');
  validateString(body.airlineName, 'airlineName');
  validateString(body.originAirportCode, 'originAirportCode');
  validateString(body.destinationAirportCode, 'destinationAirportCode');
  validateString(body.departureDatetime, 'departureDatetime'); 
  validateString(body.arrivalDatetime, 'arrivalDatetime');   

  validateNumber(body.maxCapacityWeightKg, 'maxCapacityWeightKg');
  if (body.maxCapacityWeightKg < 0) {
    throw new Error('maxCapacityWeightKg must be a non-negative number.');
  }

  validateNumber(body.maxCapacityPieces, 'maxCapacityPieces');
  if (body.maxCapacityPieces < 0) {
    throw new Error('maxCapacityPieces must be a non-negative number.');
  }

  // overbookingPercentage
  if (body.overbookingPercentage !== undefined) {
    validateNumber(body.overbookingPercentage, 'overbookingPercentage');
    if (body.overbookingPercentage < 0 || body.overbookingPercentage > 1.0) { 
      throw new Error('overbookingPercentage must be between 0.0 and 1.0.');
    }
  }

  // awbPrefix is optional, but if present, validate it
  if (body.awbPrefix !== undefined) {
      validateString(body.awbPrefix, 'awbPrefix');
      if (body.awbPrefix.length !== 3) {
          throw new Error('awbPrefix must be exactly 3 characters long.');
      }
  }
};

export const validateUpdateFlightRequest = (body: any) => {
  // For update, fields are optional, but if present, validate them
  if (body.flightNumber !== undefined) validateString(body.flightNumber, 'flightNumber');
  if (body.airlineName !== undefined) validateString(body.airlineName, 'airlineName');
  if (body.originAirportCode !== undefined) validateString(body.originAirportCode, 'originAirportCode');
  if (body.destinationAirportCode !== undefined) validateString(body.destinationAirportCode, 'destinationAirportCode');
  if (body.departureDatetime !== undefined) validateString(body.departureDatetime, 'departureDatetime');
  if (body.arrivalDatetime !== undefined) validateString(body.arrivalDatetime, 'arrivalDatetime');

  if (body.maxCapacityWeightKg !== undefined) {
    validateNumber(body.maxCapacityWeightKg, 'maxCapacityWeightKg');
    if (body.maxCapacityWeightKg < 0) {
      throw new Error('maxCapacityWeightKg must be a non-negative number.');
    }
  }

  if (body.maxCapacityPieces !== undefined) {
    validateNumber(body.maxCapacityPieces, 'maxCapacityPieces');
    if (body.maxCapacityPieces < 0) {
      throw new Error('maxCapacityPieces must be a non-negative number.');
    }
  }

  if (body.overbookingPercentage !== undefined) {
    validateNumber(body.overbookingPercentage, 'overbookingPercentage');
    if (body.overbookingPercentage < 0 || body.overbookingPercentage > 1.0) {
      throw new Error('overbookingPercentage must be between 0.0 and 1.0.');
    }
  }

  if (body.awbPrefix !== undefined) {
    validateString(body.awbPrefix, 'awbPrefix');
    if (body.awbPrefix.length !== 3) {
        throw new Error('awbPrefix must be exactly 3 characters long.');
    }
}
};
