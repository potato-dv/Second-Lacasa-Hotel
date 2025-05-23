// resources/js/services/api.ts
import { BookingDetails, BookingResponse, RoomData } from '../types';

export class RoomAPI {
  static async getAvailableRooms(
    checkIn: Date,
    checkOut: Date,
    adults: number,
    children: number
  ): Promise<RoomData[]> {
    try {
      // Using query parameters for GET request to match Laravel's route
      const queryParams = new URLSearchParams({
        check_in: checkIn.toISOString().split('T')[0],
        check_out: checkOut.toISOString().split('T')[0],
        adults: adults.toString(),
        children: children.toString(),
      });

      const response = await fetch(`/available-rooms?${queryParams}`, {
        method: 'GET', // Changed to GET to match Laravel route
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available rooms');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      throw error;
    }
  }
}

export class BookingAPI {
  static async createBooking(bookingDetails: BookingDetails): Promise<BookingResponse> {
    try {
      const response = await fetch('/bookings', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          checkIn: bookingDetails.checkIn.toISOString().split('T')[0],
          checkOut: bookingDetails.checkOut.toISOString().split('T')[0],
          adults: bookingDetails.adults,
          children: bookingDetails.children,
          roomId: bookingDetails.selectedRoom?.id,
          guestInfo: bookingDetails.guestInfo,
          paymentMethod: bookingDetails.paymentMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }
}