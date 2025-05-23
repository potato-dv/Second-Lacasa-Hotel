<?php
// database/seeders/DatabaseSeeders.php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {

        // Create admin user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'), // Set a default password
            'role' => 'admin',
        ]);

        // Seed the user table first
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Then call your other seeders
        $this->call([
            RoomTypeSeeder::class,
            RoomSeeder::class,
        ]);
    }
}
