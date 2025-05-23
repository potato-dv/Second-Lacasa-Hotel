<?php
// database/seeders/RoomSeeder.php

namespace Database\Seeders;

use App\Models\RoomType;
use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    public function run()
    {
        $standardRoomType = RoomType::where('name', 'Standard')->first();
        $deluxeRoomType = RoomType::where('name', 'Deluxe')->first();

        // First floor Standard Rooms: 1011-1015
        for ($i = 1; $i <= 5; $i++) {
            Room::create([
                'room_number' => "101{$i}",
                'floor' => 1,
                'price' => $standardRoomType->base_price,
                'capacity' => 3,
                'available' => true,
                'room_type_id' => $standardRoomType->id
            ]);
        }

        // Second floor Standard Rooms: 2011-2015
        for ($i = 1; $i <= 5; $i++) {
            Room::create([
                'room_number' => "201{$i}",
                'floor' => 2,
                'price' => $standardRoomType->base_price,
                'capacity' => 3,
                'available' => true,
                'room_type_id' => $standardRoomType->id
            ]);
        }

        // Deluxe Rooms on third floor: 3011-3015
        for ($i = 1; $i <= 5; $i++) {
            Room::create([
                'room_number' => "301{$i}",
                'floor' => 3,
                'price' => $deluxeRoomType->base_price,
                'capacity' => 5,
                'available' => true,
                'room_type_id' => $deluxeRoomType->id
            ]);
        }
    }
}
