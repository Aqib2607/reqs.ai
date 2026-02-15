<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiLog extends Model
{
    protected $fillable = [
        'api_key_id',
        'project_id',
        'provider',
        'model',
        'operation',
        'prompt_tokens',
        'completion_tokens',
        'total_tokens',
        'latency_ms',
        'status',
        'error_message',
    ];

    public function apiKey()
    {
        return $this->belongsTo(ApiKey::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
