<?php
// app/Http/Controllers/API/BookingController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    /**
     * Store a new booking
     */
    public function store(Request $request)
    {
        $request->validate([
            'checkIn' => 'required|date',
            'checkOut' => 'required|date|after:checkIn',
            'adults' => 'required|integer|min:1',
            'children' => 'required|integer|min:0',
            'roomId' => 'required|exists:rooms,id',
            'guestInfo.fullName' => 'required|string|max:255',
            'guestInfo.email' => 'required|email|max:255',
            'guestInfo.phone' => 'required|string|max:20',
            'guestInfo.address' => 'required|string|max:500',
            'paymentMethod' => 'required|in:gcash,paypal',
            'paymentProof' => 'required|file|mimes:jpeg,png,jpg,pdf|max:5120', // 5MB maximum, required
        ]);

        // Check if the room is still available for the booking period
        $room = Room::findOrFail($request->roomId);
        $checkIn = Carbon::parse($request->checkIn);
        $checkOut = Carbon::parse($request->checkOut);
        
        // Calculate number of nights
        $nights = $checkIn->diffInDays($checkOut);
        if ($nights < 1) $nights = 1; // Minimum 1 night
        
        // Calculate total price
        $totalPrice = $room->price * $nights;

        // Format guest info for database
        $guestInfo = [
            'full_name' => $request->input('guestInfo.fullName'),
            'email' => $request->input('guestInfo.email'),
            'phone' => $request->input('guestInfo.phone'),
            'address' => $request->input('guestInfo.address'),
            'special_requests' => $request->input('guestInfo.specialRequests'),
        ];

        // Get the authenticated user's ID if available
        $userId = null;
        if (Auth::check()) {
            $userId = Auth::id();
        } elseif ($request->has('userId')) {
            // Optionally allow passing user_id directly (for testing or admin functions)
            $userId = $request->userId;
        }

        // Handle payment proof file upload - required
        if (!$request->hasFile('paymentProof')) {
            return response()->json(['message' => 'Payment proof is required'], 422);
        }
        
        // Generate a unique filename
        $filename = Str::uuid() . '.' . $request->file('paymentProof')->extension();
        
        // Store the file in a bookings/payment_proofs directory
        $paymentProofPath = $request->file('paymentProof')->storeAs(
            'bookings/payment_proofs', 
            $filename, 
            'public'
        );

        // Create the booking
        $booking = Booking::create([
            'booking_reference' => Str::upper(Str::random(8)),
            'room_id' => $request->roomId,
            'user_id' => $userId,
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'adults' => $request->adults,
            'children' => $request->children,
            'total_price' => $totalPrice,
            'payment_method' => $request->paymentMethod,
            'payment_proof' => $paymentProofPath, // Required payment proof path
            'guest_info' => $guestInfo,
            'status' => 'pending',
        ]);

        // Get room details for the response
        $roomDetails = [
            'type' => $room->roomType->name,
            'roomNumber' => $room->room_number,
        ];

        // Format the response
        $response = [
            'id' => $booking->booking_reference,
            'room' => $roomDetails,
            'userId' => $booking->user_id,
            'checkIn' => $booking->check_in->format('Y-m-d'),
            'checkOut' => $booking->check_out->format('Y-m-d'),
            'adults' => $booking->adults,
            'children' => $booking->children,
            'totalPrice' => $booking->total_price,
            'paymentMethod' => $booking->payment_method,
            'paymentProof' => url('storage/' . $booking->payment_proof),
            'guestInfo' => [
                'fullName' => $guestInfo['full_name'],
                'email' => $guestInfo['email'],
                'phone' => $guestInfo['phone'],
                'address' => $guestInfo['address'],
                'specialRequests' => $guestInfo['special_requests'] ?? null,
            ],
            'status' => $booking->status,
        ];

        return response()->json($response, 201);
    }

    /**
     * Display the specified booking
     */
    public function show($id)
    {
        $booking = Booking::with(['room.roomType', 'user'])
            ->where('booking_reference', $id)
            ->firstOrFail();

        $response = [
            'id' => $booking->booking_reference,
            'room' => [
                'type' => $booking->room->roomType->name,
                'roomNumber' => $booking->room->room_number,
            ],
            'userId' => $booking->user_id,
            'userName' => $booking->user ? $booking->user->name : null,
            'checkIn' => $booking->check_in->format('Y-m-d'),
            'checkOut' => $booking->check_out->format('Y-m-d'),
            'adults' => $booking->adults,
            'children' => $booking->children,
            'totalPrice' => $booking->total_price,
            'paymentMethod' => $booking->payment_method,
            'paymentProof' => url('storage/' . $booking->payment_proof),
            'guestInfo' => $booking->guest_info,
            'status' => $booking->status,
        ];

        return response()->json($response);
    }
    
    /**
     * Get bookings for the authenticated user
     */
    public function userBookings()
    {
        // Ensure the user is authenticated
        if (!Auth::check()) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $userId = Auth::id();
        $bookings = Booking::with('room.roomType')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        $response = $bookings->map(function ($booking) {
            return [
                'id' => $booking->booking_reference,
                'room' => [
                    'id' => $booking->room->id,
                    'name' => $booking->room->name,
                    'type' => $booking->room->roomType->name,
                    'roomNumber' => $booking->room->room_number,
                ],
                'checkIn' => $booking->check_in->format('Y-m-d'),
                'checkOut' => $booking->check_out->format('Y-m-d'),
                'adults' => $booking->adults,
                'children' => $booking->children,
                'totalPrice' => $booking->total_price,
                'paymentMethod' => $booking->payment_method,
                'paymentProof' => url('storage/' . $booking->payment_proof),
                'guestInfo' => $booking->guest_info,
                'status' => $booking->status,
                'createdAt' => $booking->created_at->format('Y-m-d H:i:s'),
            ];
        });

        return response()->json($response);
    }
}