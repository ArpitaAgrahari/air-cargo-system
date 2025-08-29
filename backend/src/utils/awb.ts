export const generateAwbNumber = (airlinePrefix: string): string => {
  // Ensure the prefix is exactly 3 characters.
  if (airlinePrefix.length !== 3) {
    throw new Error('Airline prefix must be exactly 3 characters long.');
  }

  // Generate a simple 8-digit random number for the serial part
  const randomSerial = Math.floor(10000000 + Math.random() * 90000000).toString();

  return `${airlinePrefix}-${randomSerial}`;
};