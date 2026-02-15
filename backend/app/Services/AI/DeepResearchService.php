<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Log;

class DeepResearchService
{
    protected $orchestrator;

    public function __construct(AIOrchestrator $orchestrator)
    {
        $this->orchestrator = $orchestrator;
    }

    /**
     * Execute deep research pipeline with multiple passes.
     */
    public function executeDeepResearch(string $basePrompt, string $documentType): string
    {
        Log::info("Starting deep research for {$documentType}");

        // Pass 1: Initial Draft
        $draft = $this->draftPass($basePrompt, $documentType);
        
        // Pass 2: Critique
        $critique = $this->critiquePass($draft, $documentType);
        
        // Pass 3: Gap Detection
        $gaps = $this->gapDetectionPass($draft, $critique, $documentType);
        
        // Pass 4: Expansion
        $expanded = $this->expansionPass($draft, $gaps, $documentType);
        
        // Pass 5: Final Validation
        $final = $this->validationPass($expanded, $documentType);
        
        Log::info("Completed deep research for {$documentType}");
        
        return $final;
    }

    /**
     * Pass 1: Generate initial draft.
     */
    protected function draftPass(string $basePrompt, string $documentType): string
    {
        $prompt = $this->buildDraftPrompt($basePrompt, $documentType);
        
        $result = $this->orchestrator->generate($prompt, [
            'max_tokens' => 4000,
            'temperature' => 0.7,
        ]);
        
        return $result['content'] ?? '';
    }

    /**
     * Pass 2: Critique the draft.
     */
    protected function critiquePass(string $draft, string $documentType): string
    {
        $prompt = <<<PROMPT
You are a technical reviewer. Review the following {$documentType} document and provide a detailed critique.
Identify:
- Missing information
- Unclear sections
- Logical gaps
- Areas that need more detail
- Technical inaccuracies

Document:
{$draft}

Provide your critique:
PROMPT;

        $result = $this->orchestrator->generate($prompt, [
            'max_tokens' => 2000,
            'temperature' => 0.5,
        ]);
        
        return $result['content'] ?? '';
    }

    /**
     * Pass 3: Detect gaps in the draft.
     */
    protected function gapDetectionPass(string $draft, string $critique, string $documentType): string
    {
        $prompt = <<<PROMPT
Based on the following {$documentType} draft and critique, identify specific gaps that need to be filled.
List the gaps in a structured format.

Draft:
{$draft}

Critique:
{$critique}

List the specific gaps:
PROMPT;

        $result = $this->orchestrator->generate($prompt, [
            'max_tokens' => 1500,
            'temperature' => 0.4,
        ]);
        
        return $result['content'] ?? '';
    }

    /**
     * Pass 4: Expand the draft to fill gaps.
     */
    protected function expansionPass(string $draft, string $gaps, string $documentType): string
    {
        $prompt = <<<PROMPT
Expand and improve the following {$documentType} document by addressing these gaps:

Gaps to address:
{$gaps}

Original document:
{$draft}

Provide the complete, improved document with all gaps addressed:
PROMPT;

        $result = $this->orchestrator->generate($prompt, [
            'max_tokens' => 6000,
            'temperature' => 0.6,
        ]);
        
        return $result['content'] ?? '';
    }

    /**
     * Pass 5: Final validation.
     */
    protected function validationPass(string $expanded, string $documentType): string
    {
        $prompt = <<<PROMPT
Perform a final validation and polish of this {$documentType} document.
Ensure:
- All required sections are present
- Content is clear and comprehensive
- Formatting is consistent
- No contradictions exist
- Professional quality

Document:
{$expanded}

Provide the final, polished version:
PROMPT;

        $result = $this->orchestrator->generate($prompt, [
            'max_tokens' => 6000,
            'temperature' => 0.3,
        ]);
        
        return $result['content'] ?? '';
    }

    /**
     * Build the initial draft prompt based on document type.
     */
    protected function buildDraftPrompt(string $basePrompt, string $documentType): string
    {
        $templates = [
            'PRD' => <<<TEMPLATE
Create a comprehensive Product Requirements Document (PRD) for the following project:

{$basePrompt}

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

Provide a detailed, well-structured PRD:
TEMPLATE,
            'Design' => <<<TEMPLATE
Create a comprehensive Design Document for the following project:

{$basePrompt}

The Design Document should include:
1. System Architecture Overview
2. Component Design
3. Data Flow Diagrams
4. API Design
5. Database Schema
6. UI/UX Considerations
7. Security Design
8. Performance Considerations
9. Deployment Architecture

Provide a detailed, well-structured Design Document:
TEMPLATE,
            'TechStack' => <<<TEMPLATE
Create a comprehensive Tech Stack Document for the following project:

{$basePrompt}

The Tech Stack Document should include:
1. Frontend Technologies
2. Backend Technologies
3. Database & Storage
4. Infrastructure & DevOps
5. Third-party Services
6. Development Tools
7. Testing Framework
8. Deployment Strategy
9. Justification for each choice

Provide a detailed, well-structured Tech Stack Document:
TEMPLATE,
        ];

        return $templates[$documentType] ?? $basePrompt;
    }
}
