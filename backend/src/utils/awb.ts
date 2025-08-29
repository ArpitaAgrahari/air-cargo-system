export const generateAwbNumber = (airlinePrefix: string): string => {
  // Ensure the prefix is exactly 3 characters.
  if (airlinePrefix.length !== 3) {
    throw new Error('Airline prefix must be exactly 3 characters long.');
  }

  //random 7-digit number
  const sevenDigitNumber = Math.floor(1000000 + Math.random() * 9000000);

  // Calculate the check digit (remainder of 7-digit number divided by 7)
  const checkDigit = sevenDigitNumber % 7;

  // AWBnumber parts: IATA code + 7-digit number + check digit
  return `${airlinePrefix}${sevenDigitNumber}${checkDigit}`;
};
