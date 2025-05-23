<?php
// app/Services/BookingService.php
namespace App\Services;

use App\Models\Booking;
use App\Models\Guest;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;

class BookingService
{
    protected $roomService;

    public function __construct(RoomService $roomService)
    {
        $this->roomService = $roomService;
    }

    public function createBooking(array $data, UploadedFile $paymentProofFile): Booking
    {
        // Start a transaction to ensure booking and guest creation are atomic
        return DB::transaction(function() use ($data, $paymentProofFile) {
            // Create or update guest
            $guest = Guest::updateOrCreate(
                ['email' => $data['guest_info']['email']],
                [
                    'full_name' => $data['guest_info']['full_name'],
                    'phone' => $data['guest_info']['phone'],
                    'address' => $data['guest_info']['address'],
                    'special_requests' => $data['guest_info']['special_requests'] ?? null,
                ]
            );

            // Get room
            $room = Room::findOrFail($data['room_id']);
            
            // Calculate stay duration and total price
            $checkIn = Carbon::parse($data['check_in']);
            $checkOut = Carbon::parse($data['check_out']);
            $stayDurationInDays = max(1, $checkOut->diffInDays($checkIn));
            $totalPrice = $room->price * $stayDurationInDays;

            // Get the authenticated user's ID if available
            $userId = Auth::check() ? Auth::id() : null;
            
            // Generate booking reference
            $bookingReference = Str::upper(Str::random(8));
            
            // Handle payment proof file upload (required)
            // Generate a unique filename
            $filename = Str::uuid() . '.' . $paymentProofFile->extension();
            
            // Store the file in a bookings/payment_proofs directory
            $paymentProofPath = $paymentProofFile->storeAs(
                'bookings/payment_proofs', 
                $filename, 
                'public'
            );

            // Create booking
            $booking = Booking::create([
                'booking_reference' => $bookingReference,
                'room_id' => $room->id,
                'guest_id' => $guest->id,
                'user_id' => $userId, // Add the user_id if authenticated
                'check_in' => $checkIn,
                'check_out' => $checkOut,
                'adults' => $data['adults'],
                'children' => $data['children'] ?? 0,
                'total_price' => $totalPrice,
                'status' => 'pending',
                'payment_method' => $data['payment_method'],
                'payment_proof' => $paymentProofPath, // Required field
                'guest_info' => $data['guest_info'],
            ]);

            // Load relationships
            $booking->load(['room.roomType', 'guest']);
            
            return $booking;
        });
    }

    public function getBookingDetails(Booking $booking): array
    {
        $booking->load(['room.roomType', 'guest', 'user']);
        
        return [
            'id' => $booking->id,
            'bookingReference' => $booking->booking_reference,
            'room' => $this->roomService->getRoomDetails($booking->room),
            'userId' => $booking->user_id,
            'userName' => $booking->user ? $booking->user->name : null,
            'checkIn' => $booking->check_in->format('Y-m-d'),
            'checkOut' => $booking->check_out->format('Y-m-d'),
            'adults' => $booking->adults,
            'children' => $booking->children,
            'totalPrice' => $booking->total_price,
            'status' => $booking->status,
            'paymentMethod' => $booking->payment_method,
            'paymentProof' => url('storage/' . $booking->payment_proof),
            'guestInfo' => [
                'fullName' => $booking->guest->full_name,
                'email' => $booking->guest->email,
                'phone' => $booking->guest->phone,
                'address' => $booking->guest->address,
                'specialRequests' => $booking->guest->special_requests,
            ],
            'createdAt' => $booking->created_at->format('Y-m-d H:i:s'),
        ];
    }

    public function updateBooking(Booking $booking, array $data, ?UploadedFile $paymentProofFile = null): Booking
    {
        // Handle payment proof file upload if provided
        if ($paymentProofFile) {
            // Remove old file if exists
            if ($booking->payment_proof && Storage::disk('public')->exists($booking->payment_proof)) {
                Storage::disk('public')->delete($booking->payment_proof);
            }

            // Generate a unique filename
            $filename = Str::uuid() . '.' . $paymentProofFile->extension();
            
            // Store the file
            $paymentProofPath = $paymentProofFile->storeAs(
                'bookings/payment_proofs',
                $filename,
                'public'
            );
            
            $data['payment_proof'] = $paymentProofPath;
        }

        $booking->update($data);
        return $booking;
    }

    // You might want to add a method to get a user's bookings
    public function getUserBookings($userId = null)
    {
        // If no userId is provided, get the authenticated user's ID
        if (!$userId && Auth::check()) {
            $userId = Auth::id();
        }

        // If we still don't have a userId, return empty collection
        if (!$userId) {
            return collect([]);
        }

        // Get all bookings for this user
        $bookings = Booking::where('user_id', $userId)
            ->with(['room.roomType', 'guest'])
            ->orderBy('created_at', 'desc')
            ->get();

        return $bookings->map(function ($booking) {
            return $this->getBookingDetails($booking);
        });
    }

}