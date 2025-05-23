<?php
// routes/settings.php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Regular user settings routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');
});

// Admin settings routes 
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::redirect('settings', 'admin/settings/profile');

    // Using the controller method instead of closure for consistency
    Route::get('settings/profile', [ProfileController::class, 'adminEdit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'adminUpdate'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'adminDestroy'])->name('profile.destroy');

    // If you have an AdminPasswordController, use it here
    Route::get('settings/AdminPassword', function () {
        return Inertia::render('settings/AdminPassword');
    })->name('admin.password.edit');
    
    Route::put('settings/password', [PasswordController::class, 'adminUpdate'])->name('admin.password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/AdminAppearance');
    })->name('admin.appearance');
});