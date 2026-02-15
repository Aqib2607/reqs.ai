<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DesignDocument extends Model
{
    protected $fillable = [
        'project_id',
        'content',
        'version',
        'is_approved',
        'approved_at',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function versions()
    {
        return $this->morphMany(DocumentVersion::class, 'versionable');
    }
}
