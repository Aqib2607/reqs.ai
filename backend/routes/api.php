<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ApiKeyController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\ProfileController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return response()->json(['user' => $request->user()]);
    });
    Route::patch('/user/profile', [ProfileController::class, 'update']);
    Route::patch('/user/preferences', [ProfileController::class, 'updatePreferences']);
    Route::post('/user/password', [ProfileController::class, 'changePassword']);
    Route::post('/user/delete-account', [ProfileController::class, 'destroy']);

    // Projects
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
    Route::post('/project/clarify', [DocumentController::class, 'clarifyScope']);

    // Documents
    Route::post('/prd/generate', [DocumentController::class, 'generatePRD']);
    Route::post('/design/generate', [DocumentController::class, 'generateDesign']);
    Route::post('/techstack/generate', [DocumentController::class, 'generateTechStack']);
    Route::post('/document/regenerate', [DocumentController::class, 'regenerate']);
    Route::post('/document/approve', [DocumentController::class, 'approve']);

    // API Keys
    Route::get('/keys/status', [ApiKeyController::class, 'getStatus']);
    Route::get('/keys', [ApiKeyController::class, 'index']);
    Route::post('/keys', [ApiKeyController::class, 'store']);
    Route::patch('/keys/{id}/activate', [ApiKeyController::class, 'activate']);
    Route::patch('/keys/{id}/set-backup', [ApiKeyController::class, 'setBackup']);
    Route::patch('/keys/{id}/priority', [ApiKeyController::class, 'updatePriority']);
    Route::patch('/keys/{id}', [ApiKeyController::class, 'update']);
    Route::delete('/keys/{id}', [ApiKeyController::class, 'destroy']);
    Route::post('/keys/{id}/health-check', [ApiKeyController::class, 'healthCheck']);

    // Export
    Route::get('/export/markdown/{project_id}', [ExportController::class, 'exportMarkdown']);
    Route::get('/export/pdf-clean/{project_id}', [ExportController::class, 'exportPDFClean']);
    Route::get('/export/pdf-academic/{project_id}', [ExportController::class, 'exportPDFAcademic']);
});
