<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class ApiKey extends Model
{
    protected $fillable = [
        'user_id',
        'provider',
        'encrypted_key',
        'name',
        'priority',
        'is_active',
        'is_backup',
        'status',
        'total_requests',
        'successful_requests',
        'avg_latency_ms',
        'last_checked_at',
        'last_used_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_backup' => 'boolean',
        'last_checked_at' => 'datetime',
        'last_used_at' => 'datetime',
    ];

    protected $hidden = [
        'encrypted_key',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function aiLogs()
    {
        return $this->hasMany(AiLog::class);
    }

    public function setEncryptedKeyAttribute($value)
    {
        $this->attributes['encrypted_key'] = Crypt::encryptString($value);
    }

    public function getDecryptedKeyAttribute()
    {
        return Crypt::decryptString($this->encrypted_key);
    }
}
