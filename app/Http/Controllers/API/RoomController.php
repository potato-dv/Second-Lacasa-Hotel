<?php
// app/Http/Controllers/API/RoomController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoomController extends Controller
{
    /**
     * Get available rooms for the given date range and guest count
     */
    public function getAvailableRooms(Request $request)
    {
        $request->validate([
            'check_in' => 'required|date',
            'check_out' => 'required|date|after:check_in',
            'adults' => 'required|integer|min:1',
            'children' => 'required|integer|min:0',
        ]);

        $checkIn = Carbon::parse($request->check_in);
        $checkOut = Carbon::parse($request->check_out);
        $totalGuests = $request->adults + $request->children;

        // Get rooms that aren't booked in the specified date range and can accommodate the guests
        $availableRooms = Room::with('roomType')
            ->where('capacity', '>=', $totalGuests)
            ->where('available', true)
            ->whereNotIn('id', function ($query) use ($checkIn, $checkOut) {
                $query->select('room_id')
                    ->from('bookings')
                    ->where(function ($q) use ($checkIn, $checkOut) {
                        // Find bookings that overlap with the requested period
                        $q->where('check_in', '<', $checkOut)
                          ->where('check_out', '>', $checkIn);
                    });
            })
            ->get();

        // Format the response to match frontend expectations
        $formattedRooms = $availableRooms->map(function ($room) {
            return [
                'id' => $room->id,
                'roomNumber' => $room->room_number,
                'floor' => $room->floor,
                'price' => (float) $room->price,
                'capacity' => $room->capacity,
                'type' => $room->roomType->name,
                'features' => $room->roomType->features,
            ];
        });

        return response()->json($formattedRooms);
    }
}