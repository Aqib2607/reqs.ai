<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentVersion extends Model
{
    protected $fillable = [
        'versionable_id',
        'versionable_type',
        'content',
        'version_number',
        'change_summary',
    ];

    public function versionable()
    {
        return $this->morphTo();
    }
}
