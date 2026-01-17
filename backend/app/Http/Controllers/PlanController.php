<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->plans()->where('is_deleted', false)->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'idea' => 'required|string',
            'content' => 'required|array',
        ]);

        return $request->user()->plans()->create($validated);
    }

    public function show(Plan $plan)
    {
        return $plan;
    }

    public function update(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'idea' => 'string',
            'content' => 'array',
            'status' => 'string',
            'visibility' => 'string',
        ]);

        $plan->update($validated);
        return $plan;
    }

    public function destroy(Plan $plan)
    {
        $plan->update(['is_deleted' => true]);
        return response()->noContent();
    }
}
