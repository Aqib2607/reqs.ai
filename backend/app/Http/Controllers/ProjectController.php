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
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'description' => $project->description,
                    'status' => $project->status,
                    'created_at' => $project->created_at->format('Y-m-d'),
                    'prd_document' => $project->prdDocument,
                    'design_document' => $project->designDocument,
                    'tech_stack_document' => $project->techStackDocument,
                ];
            });

        return response()->json(['projects' => $projects]);
    }

    public function show(Request $request, $id)
    {
        $project = $request->user()->projects()
            ->with(['prdDocument', 'designDocument', 'techStackDocument'])
            ->findOrFail($id);

        return response()->json([
            'project' => [
                'id'                  => $project->id,
                'name'                => $project->name,
                'description'         => $project->description,
                'status'              => $project->status,
                'created_at'          => $project->created_at->format('Y-m-d'),
                'prd_document'        => $project->prdDocument,
                'design_document'     => $project->designDocument,
                'tech_stack_document' => $project->techStackDocument,
            ]
        ]);
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

        return response()->json([
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'status' => $project->status,
                'created_at' => $project->created_at->format('Y-m-d'),
                'prd_document' => null,
                'design_document' => null,
                'tech_stack_document' => null,
            ]
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $project = $request->user()->projects()->findOrFail($id);
        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }
}
