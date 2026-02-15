<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function prdDocument()
    {
        return $this->hasOne(PrdDocument::class);
    }

    public function designDocument()
    {
        return $this->hasOne(DesignDocument::class);
    }

    public function techStackDocument()
    {
        return $this->hasOne(TechStackDocument::class);
    }

    public function aiLogs()
    {
        return $this->hasMany(AiLog::class);
    }
}
