<?php
// app/Http/Controllers/Admin/DashboardController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Fetch bookings with related room and user data
        $bookings = Booking::with(['room', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        // For debugging - check if data is being retrieved correctly
        // You can check your Laravel logs to see this output
        \Log::info('Bookings data:', ['count' => $bookings->count(), 'sample' => $bookings->first()]);

        // Return the admin dashboard view with bookings data
        return Inertia::render('Admin/Dashboard', [
            'bookings' => $bookings,
        ]);
    }
}