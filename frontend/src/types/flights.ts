export interface Flight {
    id: number;
    flight_number: string;
    airline_name: string;
    awb_prefix: string;
    origin_airport_code: string;
    destination_airport_code: string;
    departure_datetime: string;
    arrival_datetime: string;  
  }