<?php

namespace App\Services;

class AIOutputValidator
{
    /**
     * Validate AI-generated document content.
     */
    public function validate(string $content, string $documentType): array
    {
        $errors = [];

        // Check minimum length
        if (strlen($content) < 500) {
            $errors[] = 'Content is too short (minimum 500 characters required)';
        }

        // Check for required headings based on document type
        $requiredHeadings = $this->getRequiredHeadings($documentType);
        foreach ($requiredHeadings as $heading) {
            if (!$this->containsHeading($content, $heading)) {
                $errors[] = "Missing required section: {$heading}";
            }
        }

        // Check for proper markdown structure
        if (!$this->hasProperMarkdownStructure($content)) {
            $errors[] = 'Content lacks proper markdown structure';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
        ];
    }

    /**
     * Get required headings for a document type.
     */
    protected function getRequiredHeadings(string $documentType): array
    {
        return match($documentType) {
            'PRD' => [
                'Executive Summary',
                'Product Vision',
                'Features',
                'Requirements',
            ],
            'Design' => [
                'System Architecture',
                'Component Design',
                'Database Schema',
                'API Design',
            ],
            'TechStack' => [
                'Frontend Technologies',
                'Backend Technologies',
                'Database',
                'Infrastructure',
            ],
            default => [],
        };
    }

    /**
     * Check if content contains a heading (case-insensitive).
     */
    protected function containsHeading(string $content, string $heading): bool
    {
        return stripos($content, $heading) !== false;
    }

    /**
     * Check if content has proper markdown structure.
     */
    protected function hasProperMarkdownStructure(string $content): bool
    {
        // Check for at least one heading
        if (!preg_match('/^#{1,6}\s+.+$/m', $content)) {
            return false;
        }

        // Check for paragraphs (multiple lines of text)
        $lines = explode("\n", trim($content));
        if (count($lines) < 10) {
            return false;
        }

        return true;
    }

    /**
     * Sanitize and clean AI output.
     */
    public function sanitize(string $content): string
    {
        // Remove any potential script tags
        $content = preg_replace('/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i', '', $content);
        
        // Remove any HTML except basic formatting
        $allowedTags = '<p><br><strong><em><ul><ol><li><h1><h2><h3><h4><h5><h6><code><pre>';
        $content = strip_tags($content, $allowedTags);
        
        return $content;
    }
}
