<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $projects = $request->user()->projects()
            ->with(['prdDocument', 'designDocument', 'techStackDocument'])
            ->latest()
            ->get();

        return response()->json($projects);
    }

    public function show(Request $request, $id)
    {
        $project = $request->user()->projects()
            ->with(['prdDocument', 'designDocument', 'techStackDocument'])
            ->findOrFail($id);

        return response()->json($project);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $project = $request->user()->projects()->create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'status' => 'draft',
        ]);

        return response()->json($project, 201);
    }
}
