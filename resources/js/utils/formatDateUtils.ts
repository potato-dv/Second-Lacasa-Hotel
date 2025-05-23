// Example of how to format dates before API submission
import { format } from 'date-fns';
import { BookingDetails } from '../types';
import axios from 'axios'; // or whatever HTTP client you're using

export const submitBooking = async (bookingDetails: BookingDetails) => {
  try {
    // Clone the booking details to avoid mutating the original state
    const formattedBookingData = {
      ...bookingDetails,
      // Format dates to match backend expectation: 'yyyy-MM-dd'
      checkIn: format(bookingDetails.checkIn, 'yyyy-MM-dd'),
      checkOut: format(bookingDetails.checkOut, 'yyyy-MM-dd'),
      guestInfo: {
        ...bookingDetails.guestInfo,
      }
    };

    // Send the formatted data to your API
    const response = await axios.post('/api/bookings', formattedBookingData);
    return response.data;
  } catch (error) {
    console.error('Error submitting booking:', error);
    throw error;
  }
};