<?php
namespace App\Services;

use App\Models\SocialAccount;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class GoogleAuthService
{
    public function findOrCreateUser($googleUser): User
    {
        // Check if social account exists
        $socialAccount = SocialAccount::where('provider', 'google')
            ->where('provider_id', $googleUser->getId())
            ->first();

        if ($socialAccount) {
            return $socialAccount->user;
        }

        // Check if user exists with same email
        $existingUser = User::where('email', $googleUser->getEmail())->first();

        if ($existingUser) {
            $this->createSocialAccount($existingUser, $googleUser);
            return $existingUser;
        }

        // Create new user
        $newUser = User::create([
            'name' => $googleUser->getName(),
            'email' => $googleUser->getEmail(),
            'password' => Hash::make(Str::random(24)),
            'email_verified_at' => now(),
        ]);

        $this->createSocialAccount($newUser, $googleUser);

        return $newUser;
    }

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