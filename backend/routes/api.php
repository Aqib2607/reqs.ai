<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PlanController;
use App\Http\Controllers\PRDController;
use App\Http\Controllers\ApiKeyController;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Plan Routes
    Route::apiResource('plans', PlanController::class);

    // PRD Routes
    Route::get('prds', [PRDController::class, 'index']);
    Route::get('prds/{prd_document}', [PRDController::class, 'show']);
    Route::post('plans/{plan}/generate-prd', [PRDController::class, 'store']);

    // API Key Routes
    Route::get('api-keys', [ApiKeyController::class, 'index']);
    Route::post('api-keys', [ApiKeyController::class, 'store']);
    Route::delete('api-keys/{api_key}', [ApiKeyController::class, 'destroy']);
});
