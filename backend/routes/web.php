<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;

// OAuth Routes
Route::get('/auth/{provider}/redirect', [AuthController::class, 'redirectToProvider']);
Route::get('/auth/{provider}/callback', [AuthController::class, 'handleProviderCallback']);

// Serve the React SPA for all routes except /api/* and /api
Route::get('/{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '^(?!api($|/)).*$');
