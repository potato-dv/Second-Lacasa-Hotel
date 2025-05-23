<?php
// app/Http/Controllers/Admin/BookingController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display a listing of the bookings.
     */
    public function index()
    {
        $bookings = Booking::with(['room', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings
        ]);
    }

    /**
     * Display the specified booking.
     */
    public function show(Booking $booking)
    {
        $booking->load(['room', 'user']);
        
        return Inertia::render('Admin/Bookings/Show', [
            'booking' => $booking
        ]);
    }

    /**
     * Show the form for editing the specified booking.
     */
    public function edit(Booking $booking)
    {
        $booking->load(['room', 'user']);
        $rooms = Room::all();
        
        return Inertia::render('Admin/Bookings/Edit', [
            'booking' => $booking,
            'rooms' => $rooms,
        ]);
    }

    /**
     * Update the specified booking in storage.
     */
    public function update(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'check_in' => 'required|date',
            'check_out' => 'required|date|after:check_in',
            'adults' => 'required|integer|min:1',
            'children' => 'required|integer|min:0',
            'total_price' => 'required|numeric|min:0',
            'status' => 'required|in:pending,confirmed,cancelled,completed',
            'payment_method' => 'required|in:gcash,paypal', // Updated to match frontend values
            'guest_info.full_name' => 'required|string',
            'guest_info.email' => 'required|email',
            'guest_info.phone' => 'required|string',
            'guest_info.address' => 'nullable|string',
            'guest_info.special_requests' => 'nullable|string',
        ]);

        // Make sure guest_info is properly formatted as an array
        $validated['guest_info'] = [
            'full_name' => $request->input('guest_info.full_name'),
            'email' => $request->input('guest_info.email'),
            'phone' => $request->input('guest_info.phone'),
            'address' => $request->input('guest_info.address'),
            'special_requests' => $request->input('guest_info.special_requests'),
        ];

        // Handle file upload if a new payment proof is provided
        if ($request->hasFile('payment_proof')) {
            $file = $request->file('payment_proof');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('payment_proofs', $filename, 'public');
            $validated['payment_proof'] = $path;
        }

        $booking->update($validated);

        return redirect()->route('admin.dashboard')->with('success', 'Booking updated successfully');
    }

    /**
     * Remove the specified booking from storage.
     */
    public function destroy(Booking $booking)
    {
        $booking->delete();
        
        return redirect()->route('admin.dashboard')->with('success', 'Booking deleted successfully');
    }
}