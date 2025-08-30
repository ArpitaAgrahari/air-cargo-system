import { validateNumber, validateString } from './common.validator';

export const validateCreateBookingRequest = (body: any) => {
  validateString(body.origin_airport_code, 'origin_airport_code');
  validateString(body.destination_airport_code, 'destination_airport_code');
  validateNumber(body.pieces, 'pieces');
  validateNumber(body.weight_kg, 'weight_kg');
  validateNumber(body.flight_id, 'flight_id');
};

export const validateUpdateBookingRequest = (body: any) => {
  validateString(body.awb_no, 'awb_no');
  validateString(body.new_status, 'new_status');

  const validStatuses = ['DEPARTED', 'ARRIVED', 'DELIVERED', 'CANCELLED'] as const;
  if (!validStatuses.includes(body.new_status as any)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  // Optional fields for DEPARTED/ARRIVED events
  if (body.new_status === 'DEPARTED' || body.new_status === 'ARRIVED') {
    if (body.location) {
      validateString(body.location, 'location');
    }
  }
  if (body.new_status === 'DEPARTED' && body.flight_id) {
      validateNumber(body.flight_id, 'flight_id');
  }
};