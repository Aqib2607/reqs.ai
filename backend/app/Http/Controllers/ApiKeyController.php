<?php

namespace App\Http\Controllers;

use App\Models\ApiKey;
use Illuminate\Http\Request;

class ApiKeyController extends Controller
{
    public function index(Request $request)
    {
        $apiKeys = $request->user()->apiKeys()
            ->orderBy('priority', 'desc')
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
            'encrypted_key' => $validated['key'], // Will be encrypted by the model
            'name' => $validated['name'] ?? null,
            'priority' => $validated['priority'] ?? 0,
            'is_active' => true,
        ]);

        return response()->json($apiKey, 201);
    }

    public function update(Request $request, $id)
    {
        $apiKey = $request->user()->apiKeys()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'priority' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $apiKey->update($validated);

        return response()->json($apiKey);
    }

    public function destroy(Request $request, $id)
    {
        $apiKey = $request->user()->apiKeys()->findOrFail($id);
        $apiKey->delete();

        return response()->json([
            'message' => 'API key deleted successfully',
        ]);
    }
}
