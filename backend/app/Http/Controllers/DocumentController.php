<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\PrdDocument;
use App\Models\DesignDocument;
use App\Models\TechStackDocument;
use App\Services\AI\AIOrchestrator;
use App\Services\AI\DeepResearchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DocumentController extends Controller
{
    public function generatePRD(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'project_description' => 'required|string',
            'use_deep_research' => 'nullable|boolean',
        ]);

        $project = $request->user()->projects()->findOrFail($validated['project_id']);

        try {
            $orchestrator = new AIOrchestrator($request->user(), $project);
            
            $content = '';
            if ($validated['use_deep_research'] ?? false) {
                $deepResearch = new DeepResearchService($orchestrator);
                $content = $deepResearch->executeDeepResearch(
                    $validated['project_description'],
                    'PRD'
                );
            } else {
                $result = $orchestrator->generate(
                    $this->buildPRDPrompt($validated['project_description'])
                );
                $content = $result['content'] ?? '';
            }

            // Create or update PRD document
            $prd = PrdDocument::updateOrCreate(
                ['project_id' => $project->id],
                [
                    'content' => $content,
                    'version' => DB::raw('version + 1'),
                ]
            );

            // Save version history
            $prd->versions()->create([
                'content' => $content,
                'version_number' => $prd->version,
                'change_summary' => 'Generated PRD document',
            ]);

            return response()->json([
                'document' => $prd,
                'message' => 'PRD generated successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('PRD generation failed: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to generate PRD: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function generateDesign(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'prd_content' => 'nullable|string',
            'use_deep_research' => 'nullable|boolean',
        ]);

        $project = $request->user()->projects()->findOrFail($validated['project_id']);
        $prd = $project->prdDocument;

        try {
            $orchestrator = new AIOrchestrator($request->user(), $project);
            $basePrompt = $validated['prd_content'] ?? $prd?->content ?? '';

            $content = '';
            if ($validated['use_deep_research'] ?? false) {
                $deepResearch = new DeepResearchService($orchestrator);
                $content = $deepResearch->executeDeepResearch($basePrompt, 'Design');
            } else {
                $result = $orchestrator->generate(
                    $this->buildDesignPrompt($basePrompt)
                );
                $content = $result['content'] ?? '';
            }

            $design = DesignDocument::updateOrCreate(
                ['project_id' => $project->id],
                [
                    'content' => $content,
                    'version' => DB::raw('version + 1'),
                ]
            );

            $design->versions()->create([
                'content' => $content,
                'version_number' => $design->version,
                'change_summary' => 'Generated Design document',
            ]);

            return response()->json([
                'document' => $design,
                'message' => 'Design document generated successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('Design generation failed: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to generate Design document: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function generateTechStack(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'design_content' => 'nullable|string',
            'use_deep_research' => 'nullable|boolean',
        ]);

        $project = $request->user()->projects()->findOrFail($validated['project_id']);
        $design = $project->designDocument;

        try {
            $orchestrator = new AIOrchestrator($request->user(), $project);
            $basePrompt = $validated['design_content'] ?? $design?->content ?? '';

            $content = '';
            if ($validated['use_deep_research'] ?? false) {
                $deepResearch = new DeepResearchService($orchestrator);
                $content = $deepResearch->executeDeepResearch($basePrompt, 'TechStack');
            } else {
                $result = $orchestrator->generate(
                    $this->buildTechStackPrompt($basePrompt)
                );
                $content = $result['content'] ?? '';
            }

            $techStack = TechStackDocument::updateOrCreate(
                ['project_id' => $project->id],
                [
                    'content' => $content,
                    'version' => DB::raw('version + 1'),
                ]
            );

            $techStack->versions()->create([
                'content' => $content,
                'version_number' => $techStack->version,
                'change_summary' => 'Generated Tech Stack document',
            ]);

            return response()->json([
                'document' => $techStack,
                'message' => 'Tech Stack document generated successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('Tech Stack generation failed: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to generate Tech Stack document: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function regenerate(Request $request)
    {
        $validated = $request->validate([
            'document_type' => 'required|in:prd,design,techstack',
            'document_id' => 'required|integer',
            'feedback' => 'nullable|string',
        ]);

        try {
            $document = $this->getDocument($validated['document_type'], $validated['document_id']);
            $project = $document->project;

            // Ensure user owns the project
            if ($project->user_id !== $request->user()->id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $orchestrator = new AIOrchestrator($request->user(), $project);
            
            $prompt = $this->buildRegeneratePrompt(
                $document->content,
                $validated['feedback'] ?? '',
                $validated['document_type']
            );

            $result = $orchestrator->generate($prompt);
            $content = $result['content'] ?? '';

            $document->update([
                'content' => $content,
                'version' => DB::raw('version + 1'),
            ]);

            $document->versions()->create([
                'content' => $content,
                'version_number' => $document->version,
                'change_summary' => 'Regenerated with feedback: ' . ($validated['feedback'] ?? 'No feedback'),
            ]);

            return response()->json([
                'document' => $document->fresh(),
                'message' => 'Document regenerated successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('Document regeneration failed: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to regenerate document: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function approve(Request $request)
    {
        $validated = $request->validate([
            'document_type' => 'required|in:prd,design,techstack',
            'document_id' => 'required|integer',
        ]);

        try {
            $document = $this->getDocument($validated['document_type'], $validated['document_id']);
            $project = $document->project;

            // Ensure user owns the project
            if ($project->user_id !== $request->user()->id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $document->update([
                'is_approved' => true,
                'approved_at' => now(),
            ]);

            return response()->json([
                'document' => $document,
                'message' => 'Document approved successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to approve document: ' . $e->getMessage(),
            ], 500);
        }
    }

    protected function getDocument(string $type, int $id)
    {
        return match($type) {
            'prd' => PrdDocument::findOrFail($id),
            'design' => DesignDocument::findOrFail($id),
            'techstack' => TechStackDocument::findOrFail($id),
        };
    }

    protected function buildPRDPrompt(string $description): string
    {
        return <<<PROMPT
Create a comprehensive Product Requirements Document (PRD) for the following project:

{$description}

The PRD should include:
1. Executive Summary
2. Product Vision & Goals
3. Target Users & Personas
4. Features & Requirements
5. User Stories
6. Success Metrics
7. Technical Considerations
8. Timeline & Milestones
9. Risks & Mitigation

Use markdown formatting and provide detailed content for each section.
PROMPT;
    }

    protected function buildDesignPrompt(string $prdContent): string
    {
        return <<<PROMPT
Based on the following PRD, create a comprehensive Design Document:

{$prdContent}

The Design Document should include:
1. System Architecture Overview
2. Component Design
3. Data Flow Diagrams (described in text)
4. API Design
5. Database Schema
6. UI/UX Considerations
7. Security Design
8. Performance Considerations
9. Deployment Architecture

Use markdown formatting and provide detailed content for each section.
PROMPT;
    }

    protected function buildTechStackPrompt(string $designContent): string
    {
        return <<<PROMPT
Based on the following Design Document, create a comprehensive Tech Stack Document:

{$designContent}

The Tech Stack Document should include:
1. Frontend Technologies
2. Backend Technologies
3. Database & Storage
4. Infrastructure & DevOps
5. Third-party Services
6. Development Tools
7. Testing Framework
8. Deployment Strategy
9. Justification for each technology choice

Use markdown formatting and provide detailed content for each section.
PROMPT;
    }

    protected function buildRegeneratePrompt(string $currentContent, string $feedback, string $type): string
    {
        return <<<PROMPT
Improve the following {$type} document based on this feedback:

Feedback: {$feedback}

Current document:
{$currentContent}

Provide an improved version that addresses the feedback while maintaining all required sections.
PROMPT;
    }
}
