<?php
// database/seeders/RoomTypeSeeder.php
namespace Database\Seeders;

use App\Models\RoomType;
use Illuminate\Database\Seeder;

class RoomTypeSeeder extends Seeder
{
    public function run()
    {
        $roomTypes = [
            [
                'name' => 'Standard',
                'base_price' => 2500,
                'features' => [
                    'workDesk' => true,
                    'freeWifi' => true,
                    'flatScreenTv' => true,
                    'coffeeMaker' => true
                ]
            ],
            [
                'name' => 'Deluxe',
                'base_price' => 4000,
                'features' => [
                    'premiumBedding' => true,
                    'miniBar' => true,
                    'enhancedWifi' => true,
                    'luxuryBathroom' => true,
                    'privateBalcony' => true,
                    'roomService' => true,
                    'smartTv' => true
                ]
            ],
        ];

        foreach ($roomTypes as $roomType) {
            RoomType::updateOrCreate(
                ['name' => $roomType['name']], // Unique key: based on 'name'
                $roomType                    // Data to update or insert
            );
        }
    }
}
