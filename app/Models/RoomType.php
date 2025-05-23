<?php
// app/Models/RoomType.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'base_price',
        'features'
    ];

    protected $casts = [
        'features' => 'array',
        'base_price' => 'float',
    ];

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }
}