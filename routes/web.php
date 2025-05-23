<?php
// routes/web.php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\API\RoomController;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Admin\RoomController as AdminRoomController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Auth\DashboardController;
use App\Http\Controllers\Auth\UserBookingController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| These routes are loaded by the "web" middleware group.
| They support sessions, CSRF protection, and more.
|--------------------------------------------------------------------------
*/

// Admin Routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // Admin Booking Management - Already using resource routes which include show, edit, update, destroy
    Route::resource('bookings', AdminBookingController::class);
    
    // Room Management Routes can be added here as well
    // Route::resource('rooms', AdminRoomController::class);
});

// User Dashboard Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        if (auth()->user()->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }
        return app(DashboardController::class)->index();
    })->name('dashboard');

    // User Booking Routes
    Route::get('/bookings', [UserBookingController::class, 'index'])->name('user.bookings');
    Route::get('/bookings/{reference}', [UserBookingController::class, 'show'])->name('user.bookings.show');
    Route::post('/bookings/{reference}/cancel', [UserBookingController::class, 'cancel'])->name('user.bookings.cancel');
});

// Public Routes
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/booking', function () {
    return Inertia::render('bookingfrm');
});

// API-like Routes
Route::get('/available-rooms', [RoomController::class, 'getAvailableRooms']);
Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/bookings/{id}', [BookingController::class, 'show']);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';