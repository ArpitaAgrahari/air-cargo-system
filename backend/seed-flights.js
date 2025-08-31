import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Indian cities with their IATA airport codes
const indianCities = [
  { name: 'Mumbai', code: 'BOM' },
  { name: 'Delhi', code: 'DEL' },
  { name: 'Bangalore', code: 'BLR' },
  { name: 'Hyderabad', code: 'HYD' },
  { name: 'Chennai', code: 'MAA' },
  { name: 'Kolkata', code: 'CCU' },
  { name: 'Ahmedabad', code: 'AMD' },
  { name: 'Pune', code: 'PNQ' },
  { name: 'Jaipur', code: 'JAI' },
  { name: 'Lucknow', code: 'LKO' },
  { name: 'Varanasi', code: 'VNS' },
  { name: 'Goa', code: 'GOI' },
  { name: 'Kochi', code: 'COK' },
  { name: 'Trivandrum', code: 'TRV' },
  { name: 'Indore', code: 'IDR' },
  { name: 'Bhopal', code: 'BHO' },
  { name: 'Nagpur', code: 'NAG' },
  { name: 'Vadodara', code: 'BDQ' },
  { name: 'Surat', code: 'STV' },
  { name: 'Patna', code: 'PAT' }
];

// Major Indian airlines
const airlines = [
  'Air India',
  'IndiGo',
  'SpiceJet',
  'Vistara',
  'AirAsia India',
  'Go First',
  'Alliance Air'
];

// Transit cities for DEL-BLR route
const transitCities = [
  { name: 'Mumbai', code: 'BOM' },
  { name: 'Hyderabad', code: 'HYD' },
  { name: 'Chennai', code: 'MAA' },
  { name: 'Pune', code: 'PNQ' },
  { name: 'Ahmedabad', code: 'AMD' }
];

// Generate random flight data for DEL-BLR route
function generateDELToBLRFlightData(isTransit = false, transitCity = null, isSecondLeg = false) {
  const airline = airlines[Math.floor(Math.random() * airlines.length)];
  const flightNumber = `${airline.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 9999) + 1000}`;
  
  // Generate random dates between 29/8/2025 to 29/9/2025
  const startDate = new Date(2025, 7, 29); // Month is 0-indexed, so 7 = August
  const endDate = new Date(2025, 8, 29); // Month is 0-indexed, so 8 = September
  const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
  
  // Random departure time between 6 AM and 10 PM
  const departureHour = Math.floor(Math.random() * 16) + 6; // 6 AM to 10 PM
  const departureMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
  
  const departureTime = new Date(randomDate);
  departureTime.setHours(departureHour, departureMinute, 0, 0);
  
  let originCode, destinationCode, flightDurationHours;
  
  if (!isTransit) {
    // Direct flight DEL to BLR
    originCode = 'DEL';
    destinationCode = 'BLR';
    flightDurationHours = 2.5 + Math.random() * 1; // 2.5 to 3.5 hours for direct
  } else {
    if (!isSecondLeg) {
      // First leg: DEL to transit city
      originCode = 'DEL';
      destinationCode = transitCity.code;
      flightDurationHours = 1.5 + Math.random() * 2; // 1.5 to 3.5 hours
    } else {
      // Second leg: transit city to BLR
      originCode = transitCity.code;
      destinationCode = 'BLR';
      flightDurationHours = 1.5 + Math.random() * 2; // 1.5 to 3.5 hours
      
      // For second leg, add some delay (30 min to 3 hours layover)
      const layoverMinutes = Math.floor(Math.random() * 150) + 30; // 30 to 180 minutes
      departureTime.setMinutes(departureTime.getMinutes() + layoverMinutes);
    }
  }
  
  const arrivalTime = new Date(departureTime.getTime() + flightDurationHours * 60 * 60 * 1000);
  
  // AWB prefix (3 digits)
  const awbPrefix = Math.floor(Math.random() * 900) + 100;
  
  // Capacity (random between reasonable ranges)
  const maxCapacityWeightKg = Math.floor(Math.random() * 20000) + 10000; // 10-30 tons
  const maxCapacityPieces = Math.floor(Math.random() * 500) + 200; // 200-700 pieces
  const overbookingPercentage = Math.floor(Math.random() * 15) + 5; // 5-20%

  return {
    flightNumber,
    airlineName: airline,
    awbPrefix: awbPrefix.toString(),
    originAirportCode: originCode,
    destinationAirportCode: destinationCode,
    departureDatetime: departureTime,
    arrivalDatetime: arrivalTime,
    currentBookedWeightKg: 0,
    currentBookedPieces: 0,
    maxCapacityWeightKg,
    maxCapacityPieces,
    overbookingPercentage
  };
}

async function seedFlights() {
  try {
    console.log('🌱 Starting flight seeding for DEL-BLR route...');
    
    // Check if flights already exist
    const existingFlights = await prisma.flight.count();
    if (existingFlights > 0) {
      console.log(`⚠️  Found ${existingFlights} existing flights. Do you want to continue? (y/n)`);
      // For automation, we'll continue anyway
    }

    const flights = [];
    
    // Generate 100 direct flights from DEL to BLR
    console.log('Generating 100 direct flights from DEL to BLR...');
    for (let i = 0; i < 100; i++) {
      flights.push(generateDELToBLRFlightData(false));
    }
    
    // Generate 100 transit flights (50 sets of 2-leg journeys)
    console.log('Generating 100 transit flights from DEL to BLR...');
    for (let i = 0; i < 50; i++) {
      const transitCity = transitCities[Math.floor(Math.random() * transitCities.length)];
      
      // First leg: DEL to transit city
      const firstLeg = generateDELToBLRFlightData(true, transitCity, false);
      flights.push(firstLeg);
      
      // Second leg: transit city to BLR (use same base time as first leg for scheduling)
      const secondLeg = generateDELToBLRFlightData(true, transitCity, true);
      // Ensure second leg departs after first leg arrives
      const minDepartureTime = new Date(firstLeg.arrivalDatetime.getTime() + 30 * 60 * 1000); // 30 min minimum layover
      if (secondLeg.departureDatetime < minDepartureTime) {
        secondLeg.departureDatetime = minDepartureTime;
        const flightDuration = secondLeg.arrivalDatetime.getTime() - secondLeg.departureDatetime.getTime();
        secondLeg.arrivalDatetime = new Date(secondLeg.departureDatetime.getTime() + flightDuration);
      }
      flights.push(secondLeg);
    }

    console.log('📋 Generated flight data summary:');
    console.log(`Total flights: ${flights.length}`);
    
    const directFlights = flights.filter(f => f.originAirportCode === 'DEL' && f.destinationAirportCode === 'BLR');
    console.log(`Direct DEL→BLR flights: ${directFlights.length}`);
    
    const transitFirstLegs = flights.filter(f => f.originAirportCode === 'DEL' && f.destinationAirportCode !== 'BLR');
    const transitSecondLegs = flights.filter(f => f.originAirportCode !== 'DEL' && f.destinationAirportCode === 'BLR');
    console.log(`Transit flights: ${transitFirstLegs.length} first legs, ${transitSecondLegs.length} second legs`);

    flights.slice(0, 10).forEach((flight, index) => {
      console.log(`${index + 1}. ${flight.flightNumber} (${flight.airlineName})`);
      console.log(`   ${flight.originAirportCode} → ${flight.destinationAirportCode}`);
      console.log(`   ${flight.departureDatetime.toLocaleString()} - ${flight.arrivalDatetime.toLocaleString()}`);
      console.log(`   Capacity: ${flight.maxCapacityPieces} pieces, ${flight.maxCapacityWeightKg}kg`);
      console.log(`   Current booked: ${flight.currentBookedPieces} pieces, ${flight.currentBookedWeightKg}kg`);
      console.log('');
    });
    
    if (flights.length > 10) {
      console.log(`... and ${flights.length - 10} more flights`);
    }

    // Insert flights into database
    const createdFlights = await prisma.flight.createMany({
      data: flights,
      skipDuplicates: true
    });

    console.log(`✅ Successfully created ${createdFlights.count} flights!`);
    
    // Display summary
    const totalFlights = await prisma.flight.count();
    console.log(`📊 Total flights in database: ${totalFlights}`);
    
    // Show some statistics
    const routes = await prisma.flight.groupBy({
      by: ['originAirportCode', 'destinationAirportCode'],
      _count: true
    });
    
    console.log(`🛫 Unique routes: ${routes.length}`);
    
    const airlines = await prisma.flight.groupBy({
      by: ['airlineName'],
      _count: true
    });
    
    console.log('✈️  Airlines distribution:');
    airlines.forEach(airline => {
      console.log(`   ${airline.airlineName}: ${airline._count} flights`);
    });
    
    // Show DEL-BLR specific statistics
    const delToBLRDirect = await prisma.flight.count({
      where: {
        originAirportCode: 'DEL',
        destinationAirportCode: 'BLR'
      }
    });
    
    const delTransitLegs = await prisma.flight.count({
      where: {
        originAirportCode: 'DEL',
        destinationAirportCode: { not: 'BLR' }
      }
    });
    
    const transitToBLR = await prisma.flight.count({
      where: {
        originAirportCode: { not: 'DEL' },
        destinationAirportCode: 'BLR'
      }
    });
    
    console.log('\n🎯 DEL-BLR Route Statistics:');
    console.log(`   Direct flights (DEL→BLR): ${delToBLRDirect}`);
    console.log(`   Transit first legs (DEL→other): ${delTransitLegs}`);
    console.log(`   Transit second legs (other→BLR): ${transitToBLR}`);

  } catch (error) {
    console.error('❌ Error seeding flights:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedFlights()
  .then(() => {
    console.log('🎉 Flight seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Flight seeding failed:', error);
    process.exit(1);
  });

export { seedFlights };
