<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserBookingController extends Controller
{
    /**
     * Display a listing of the user's bookings
     */
    public function index()
    {
        $user = Auth::user();
        $bookings = Booking::with(['room.roomType'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'reference' => $booking->booking_reference,
                    'roomType' => $booking->room->roomType->name,
                    'roomNumber' => $booking->room->room_number,
                    'checkIn' => $booking->check_in->format('Y-m-d'),
                    'checkOut' => $booking->check_out->format('Y-m-d'),
                    'nights' => $booking->check_in->diffInDays($booking->check_out),
                    'adults' => $booking->adults,
                    'children' => $booking->children,
                    'totalPrice' => $booking->total_price,
                    'status' => $booking->status,
                    'canCancel' => $booking->status === 'pending' && $booking->check_in->isFuture(),
                    'paymentMethod' => $booking->payment_method,
                    'paymentProof' => $booking->payment_proof ? url('storage/' . $booking->payment_proof) : null,
                    'createdAt' => $booking->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Dashboard/Bookings', [
            'bookings' => $bookings
        ]);
    }

    /**
     * Display details for a specific booking
     */
    public function show($reference)
    {
        $user = Auth::user();
        $booking = Booking::with(['room.roomType'])
            ->where('user_id', $user->id)
            ->where('booking_reference', $reference)
            ->firstOrFail();

        $bookingDetails = [
            'id' => $booking->id,
            'reference' => $booking->booking_reference,
            'room' => [
                'name' => $booking->room->name ?? '',
                'type' => $booking->room->roomType->name,
                'number' => $booking->room->room_number,
            ],
            'checkIn' => $booking->check_in->format('Y-m-d'),
            'checkOut' => $booking->check_out->format('Y-m-d'),
            'nights' => $booking->check_in->diffInDays($booking->check_out),
            'adults' => $booking->adults,
            'children' => $booking->children,
            'totalPrice' => $booking->total_price,
            'status' => $booking->status,
            'canCancel' => $booking->status === 'pending' && $booking->check_in->isFuture(),
            'paymentMethod' => $booking->payment_method,
            'paymentProof' => $booking->payment_proof ? url('storage/' . $booking->payment_proof) : null,
            'guestInfo' => $booking->guest_info,
            'createdAt' => $booking->created_at->format('Y-m-d H:i:s'),
        ];

        return Inertia::render('Dashboard/BookingDetails', [
            'booking' => $bookingDetails
        ]);
    }

    /**
     * Cancel a booking (only if it's in pending status)
     */
    public function cancel(Request $request, $reference)
    {
        $user = Auth::user();
        $booking = Booking::where('user_id', $user->id)
            ->where('booking_reference', $reference)
            ->where('status', 'pending')
            ->firstOrFail();

        // Additional check to ensure booking is in the future
        if ($booking->check_in->isPast()) {
            return redirect()->back()->with('error', 'Cannot cancel bookings with check-in dates in the past.');
        }

        // Update booking status to cancelled
        $booking->status = 'cancelled';
        $booking->save();

        return redirect()->route('user.bookings')->with('success', 'Booking cancelled successfully.');
    }
}