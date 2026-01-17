<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PRDDocument extends Model
{
    protected $fillable = [
        'user_id',
        'plan_id',
        'content',
        'version',
        'word_count',
        'generation_duration',
    ];

    protected $casts = [
        'content' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}
