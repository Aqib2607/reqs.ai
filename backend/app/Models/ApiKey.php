<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApiKey extends Model
{
    protected $fillable = [
        'user_id',
        'key_value',
        'type',
        'usage_stats',
        'status',
    ];

    protected $casts = [
        'usage_stats' => 'array',
        'key_value' => 'encrypted',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
