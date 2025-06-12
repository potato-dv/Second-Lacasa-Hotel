<?php
// app\Http\Controllers\Auth\GoogleAuthController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\SocialAccount;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Exception;

class GoogleAuthController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirectToGoogle(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            // Check if user already has a social account with this provider
            $socialAccount = SocialAccount::where('provider', 'google')
                ->where('provider_id', $googleUser->getId())
                ->first();

            if ($socialAccount) {
                // User exists, log them in
                Auth::login($socialAccount->user);
                return redirect()->intended(route('dashboard'));
            }

            // Check if user exists with the same email
            $existingUser = User::where('email', $googleUser->getEmail())->first();

            if ($existingUser) {
                // Link Google account to existing user
                $this->createSocialAccount($existingUser, $googleUser);
                Auth::login($existingUser);
                return redirect()->intended(route('dashboard'));
            }

            // Create new user
            $newUser = $this->createUser($googleUser);
            $this->createSocialAccount($newUser, $googleUser);
            
            Auth::login($newUser);
            return redirect()->intended(route('dashboard'));

        } catch (Exception $e) {
            return redirect()->route('login')->with('error', 'Google authentication failed. Please try again.');
        }
    }

    /**
     * Create a new user from Google data
     */
    private function createUser($googleUser): User
    {
        $userData = [
            'name' => $googleUser->getName(),
            'email' => $googleUser->getEmail(),
            'password' => Hash::make(Str::random(24)), // Random password since they'll use Google
            'email_verified_at' => now(), // Google emails are verified
        ];

        // Only add avatar if the column exists in your users table
        if (Schema::hasColumn('users', 'avatar')) {
            $userData['avatar'] = $googleUser->getAvatar();
        }

        return User::create($userData);
    }

    /**
     * Create social account record
     */
    private function createSocialAccount(User $user, $googleUser): SocialAccount
    {
        return SocialAccount::create([
            'user_id' => $user->id,
            'provider' => 'google',
            'provider_id' => $googleUser->getId(),
            'provider_email' => $googleUser->getEmail(),
            'provider_name' => $googleUser->getName(),
            'provider_avatar' => $googleUser->getAvatar(),
        ]);
    }
}
