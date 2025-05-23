<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Show the user dashboard with booking statistics
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get counts of different booking statuses
        $pendingBookings = Booking::where('user_id', $user->id)
            ->where('status', 'pending')
            ->count();
            
        $activeBookings = Booking::where('user_id', $user->id)
            ->where('status', 'confirmed')
            ->where('check_out', '>=', Carbon::today())
            ->count();
            
        $completedBookings = Booking::where('user_id', $user->id)
            ->where(function($query) {
                $query->where('status', 'completed')
                    ->orWhere(function($q) {
                        $q->where('status', 'confirmed')
                          ->where('check_out', '<', Carbon::today());
                    });
            })
            ->count();
            
        $cancelledBookings = Booking::where('user_id', $user->id)
            ->where('status', 'cancelled')
            ->count();

        // Get recent bookings (limit to 5)
        $recentBookings = Booking::with(['room.roomType'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'reference' => $booking->booking_reference,
                    'roomType' => $booking->room->roomType->name,
                    'checkIn' => $booking->check_in->format('Y-m-d'),
                    'checkOut' => $booking->check_out->format('Y-m-d'),
                    'totalPrice' => $booking->total_price,
                    'status' => $booking->status,
                    'canCancel' => $booking->status === 'pending' && $booking->check_in->isFuture(),
                ];
            });

        return Inertia::render('Dashboard/Index', [
            'pendingBookings' => $pendingBookings,
            'activeBookings' => $activeBookings,
            'completedBookings' => $completedBookings,
            'cancelledBookings' => $cancelledBookings,
            'recentBookings' => $recentBookings,
        ]);
    }
}