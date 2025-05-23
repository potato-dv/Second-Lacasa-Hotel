<?php
// app/Models/Booking.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_reference',
        'room_id',
        'user_id',
        'check_in',
        'check_out',
        'adults',
        'children',
        'total_price',
        'payment_method',
        'payment_proof',
        'guest_info',
        'status',
    ];

    protected $casts = [
        'guest_info' => 'array',
        'check_in' => 'datetime',
        'check_out' => 'datetime',
        'total_price' => 'float',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}