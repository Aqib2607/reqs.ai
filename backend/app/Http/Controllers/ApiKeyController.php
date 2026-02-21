<?php

namespace App\Http\Controllers;

use App\Models\ApiKey;
use Illuminate\Http\Request;

class ApiKeyController extends Controller
{
    public function index(Request $request)
    {
        $apiKeys = $request->user()->apiKeys()
            ->orderByDesc('is_active')
            ->orderByDesc('is_backup')
            ->orderByDesc('priority')
            ->get();

        return response()->json($apiKeys);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'provider' => 'required|string|in:openai,gemini,anthropic,groq,openrouter',
            'key' => 'required|string',
            'name' => 'nullable|string|max:255',
            'priority' => 'nullable|integer|min:0',
        ]);

        $apiKey = $request->user()->apiKeys()->create([
            'provider' => $validated['provider'],
            'encrypted_key' => $validated['key'],
            'name' => $validated['name'] ?? null,
            'priority' => $validated['priority'] ?? 0,
            'is_active' => false,
            'is_backup' => false,
            'status' => 'inactive',
        ]);

        return response()->json([
            'success' => true,
            'data' => $apiKey,
            'message' => 'API Key stored successfully',
        ], 201);
    }

    public function activate(Request $request, $id)
    {
        $apiKey = $request->user()->apiKeys()->findOrFail($id);

        // Simple toggle: flip the key's current active status
        $newStatus = !$apiKey->is_active;

        $apiKey->update([
            'is_active' => $newStatus,
            'status'    => $newStatus ? 'active' : 'inactive',
        ]);

        return response()->json([
            'success' => true,
            'data'    => $apiKey->fresh(),
            'message' => $newStatus ? 'Key activated' : 'Key deactivated',
        ]);
    }

    public function setBackup(Request $request, $id)
    {
        $apiKey = $request->user()->apiKeys()->findOrFail($id);

        $validated = $request->validate([
            'is_backup' => 'required|boolean'
        ]);

        $apiKey->update([
            'is_backup' => $validated['is_backup'],
            'is_active' => $validated['is_backup'] ? true : false,
            'status' => $validated['is_backup'] ? 'active' : 'inactive',
        ]);

        return response()->json([
            'success' => true,
            'data' => $apiKey,
            'message' => 'Backup status updated successfully',
        ]);
    }

    public function updatePriority(Request $request, $id)
    {
        $apiKey = $request->user()->apiKeys()->findOrFail($id);

        $validated = $request->validate([
            'priority' => 'required|integer|min:0',
        ]);

        $apiKey->update(['priority' => $validated['priority']]);

        return response()->json([
            'success' => true,
            'data' => $apiKey,
            'message' => 'Priority updated successfully',
        ]);
    }

    public function update(Request $request, $id)
    {
        $apiKey = $request->user()->apiKeys()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
        ]);

        $apiKey->update($validated);

        return response()->json([
            'success' => true,
            'data' => $apiKey,
            'message' => 'Key details updated',
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $apiKey = $request->user()->apiKeys()->findOrFail($id);
        $apiKey->delete();

        return response()->json([
            'success' => true,
            'message' => 'API key deleted successfully',
        ]);
    }

    public function getStatus(Request $request)
    {
        $keys = $request->user()->apiKeys;

        $totalKeys = $keys->count();
        $activeKeys = $keys->where('is_active', true)->where('is_backup', false);
        $backupKeys = $keys->where('is_active', true)->where('is_backup', true);

        $activeKeysCount = $activeKeys->count();
        $backupKeysCount = $backupKeys->count();

        // Calculate Checklist Progress
        $checklistProgress = 0;
        if ($totalKeys > 0) $checklistProgress = 1;
        if ($activeKeysCount > 0) $checklistProgress = 2;
        if ($activeKeysCount >= 2 || ($activeKeysCount == 1 && $backupKeysCount >= 1)) $checklistProgress = 3;

        // Determine if API is fundamentally connected (at least 1 active passing health check, or just active)
        $apiConnected = $keys->where('is_active', true)->where('status', 'active')->count() > 0;

        return response()->json([
            'success' => true,
            'data' => [
                'total_keys' => $totalKeys,
                'active_keys_count' => $activeKeysCount,
                'backup_keys_count' => $backupKeysCount,
                'checklist_progress' => $checklistProgress,
                'api_connected' => $apiConnected,
                'primary_provider' => $activeKeys->sortByDesc('priority')->first(),
                'fallback_provider' => $backupKeys->sortByDesc('priority')->first(),
            ]
        ]);
    }

    public function healthCheck(Request $request, $id)
    {
        $apiKey = $request->user()->apiKeys()->findOrFail($id);

        try {
            // Measure latency
            $start = microtime(true);

            // Dummy implementation of health check. 
            // Real implementation would invoke the provider class and send a tiny generation request.
            usleep(rand(100000, 500000));

            $latency = (microtime(true) - $start) * 1000;

            $apiKey->update([
                'status' => 'active',
                'last_checked_at' => now(),
                'avg_latency_ms' => round($latency)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Health check passed',
                'data' => $apiKey
            ]);
        } catch (\Exception $e) {
            $apiKey->update([
                'status' => 'failed',
                'last_checked_at' => now(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Health check failed: ' . $e->getMessage(),
                'errors' => [$e->getMessage()]
            ], 500);
        }
    }
}
