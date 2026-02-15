<?php

use Illuminate\Support\Facades\Route;

// Serve the React SPA for all routes except /api
Route::get('/{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '^(?!api).*$');
