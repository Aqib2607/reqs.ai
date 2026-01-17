<?php

namespace App\Http\Controllers;

use App\Models\ApiKey;
use Illuminate\Http\Request;

class ApiKeyController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'key_value' => 'required|string',
            'type' => 'nullable|string',
        ]);

        return $request->user()->apiKeys()->updateOrCreate(
            ['type' => $validated['type'] ?? 'gemini'],
            ['key_value' => $validated['key_value']]
        );
    }

    public function index(Request $request)
    {
        return $request->user()->apiKeys->map(function ($apiKey) {
            return [
                'id' => $apiKey->id,
                'type' => $apiKey->type,
                'status' => $apiKey->status,
                'created_at' => $apiKey->created_at,
                // Mask the key
                'key_hint' => '****' . substr($apiKey->key_value, -4),
            ];
        });
    }

    public function destroy(ApiKey $apiKey)
    {
        $apiKey->delete();
        return response()->noContent();
    }
}
