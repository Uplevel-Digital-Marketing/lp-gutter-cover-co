/**
 * Formats a phone number to (555) 555-5555 format
 * @param {string} value - The unformatted phone number
 * @returns {string} - The formatted phone number
 */
export const formatPhoneNumber = (value) => {
  if (!value) return value;
  
  // Remove all non-numeric characters
  const phoneNumber = value.replace(/[^\d]/g, '');
  
  // Apply formatting based on length
  if (phoneNumber.length < 4) {
    return phoneNumber;
  } else if (phoneNumber.length < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else if (phoneNumber.length <= 10) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  } else {
    // Limit to 10 digits and format
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }
}; 