<?php
// app/Services/RoomService.php
namespace App\Services;

use App\Models\Room;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class RoomService
{
    public function getAllRooms(): Collection
    {
        return Room::with('roomType')->get();
    }

    public function getRoomDetails(Room $room): array
    {
        $room->load('roomType');
        
        // Convert to format matching your frontend Room model
        return [
            'id' => $room->id,
            'roomNumber' => $room->room_number,
            'floor' => $room->floor,
            'price' => $room->price,
            'capacity' => $room->capacity,
            'available' => $room->available,
            'type' => $room->roomType->name,
            'features' => $room->roomType->features,
        ];
    }

    public function getAvailableRooms(string $checkIn, string $checkOut, int $adults, int $children = 0): Collection
    {
        $checkInDate = Carbon::parse($checkIn);
        $checkOutDate = Carbon::parse($checkOut);
        $totalGuests = $adults + $children;

        // Get IDs of rooms that are already booked for the given date range
        $bookedRoomIds = Booking::where(function($query) use ($checkInDate, $checkOutDate) {
            $query->whereBetween('check_in', [$checkInDate, $checkOutDate])
                ->orWhereBetween('check_out', [$checkInDate, $checkOutDate])
                ->orWhere(function($q) use ($checkInDate, $checkOutDate) {
                    $q->where('check_in', '<=', $checkInDate)
                      ->where('check_out', '>=', $checkOutDate);
                });
        })
        ->where('status', '!=', 'cancelled')
        ->pluck('room_id');

        // Get available rooms that can accommodate the number of guests
        $availableRooms = Room::with('roomType')
            ->where('available', true)
            ->where('capacity', '>=', $totalGuests)
            ->whereNotIn('id', $bookedRoomIds)
            ->get();

        return $availableRooms->map(function($room) {
            return $this->getRoomDetails($room);
        });
    }
}