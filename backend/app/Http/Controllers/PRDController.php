<?php

namespace App\Http\Controllers;

use App\Models\PRDDocument;
use App\Models\Plan;
use Illuminate\Http\Request;

class PRDController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->prdDocuments;
    }

    public function store(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'content' => 'required|array',
        ]);

        return $request->user()->prdDocuments()->create([
            'plan_id' => $plan->id,
            'content' => $validated['content'],
            // word_count and duration can be added later
        ]);
    }

    public function show(PRDDocument $prdDocument)
    {
        return $prdDocument;
    }
}
