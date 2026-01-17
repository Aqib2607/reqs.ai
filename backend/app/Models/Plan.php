<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = [
        'user_id',
        'idea',
        'content',
        'status',
        'visibility',
        'is_deleted',
    ];

    protected $casts = [
        'content' => 'array',
        'is_deleted' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function prdDocuments()
    {
        return $this->hasMany(PRDDocument::class);
    }
}
