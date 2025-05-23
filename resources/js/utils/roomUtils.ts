// resources/js/utils/roomUtils.
// Updated getAvailableRooms function
import { Room as RoomModel, StandardRoom, DeluxeRoom } from '../models/Room';
import { RoomAPI } from '../services/api';
import { RoomData as RoomType } from '../types';

// New function to get available rooms from API and convert to model classes
export const getAvailableRooms = async (
  checkIn: Date,
  checkOut: Date,
  adults: number,
  children: number
): Promise<RoomModel[]> => {
  try {
    const apiRooms: RoomType[] = await RoomAPI.getAvailableRooms(checkIn, checkOut, adults, children);
    
    // Convert API response rooms to model class instances
    return apiRooms.map(room => {
      // Parse floor to number if it's a string
      const floorNum = typeof room.floor === 'string' ? parseInt(room.floor, 10) : room.floor;
      
      if (room.type === 'Standard') {
        return new StandardRoom(
          room.id,
          room.roomNumber,
          floorNum,
          room.price,
          room.capacity,
          true // We know these rooms are available since they were returned from the API
        );
      } else if (room.type === 'Deluxe') {
        return new DeluxeRoom(
          room.id,
          room.roomNumber,
          floorNum,
          room.price,
          room.capacity,
          true // We know these rooms are available since they were returned from the API
        );
      } else {
        throw new Error(`Unknown room type: ${room.type}`);
      }
    });
  } catch (error) {
    console.error('Error fetching available rooms:', error);
    return [];
  }
};