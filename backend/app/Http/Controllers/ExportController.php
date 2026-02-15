<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Dompdf\Dompdf;
use Dompdf\Options;

class ExportController extends Controller
{
    public function exportMarkdown(Request $request, $project_id)
    {
        $project = $request->user()->projects()->findOrFail($project_id);
        
        $markdown = $this->buildMarkdownExport($project);
        
        return response($markdown)
            ->header('Content-Type', 'text/markdown')
            ->header('Content-Disposition', 'attachment; filename="' . $project->name . '.md"');
    }

    public function exportPDFClean(Request $request, $project_id)
    {
        $project = $request->user()->projects()->findOrFail($project_id);
        
        $html = $this->buildCleanHTML($project);
        
        return $this->generatePDF($html, $project->name . '-clean.pdf');
    }

    public function exportPDFAcademic(Request $request, $project_id)
    {
        $project = $request->user()->projects()->findOrFail($project_id);
        
        $html = $this->buildAcademicHTML($project);
        
        return $this->generatePDF($html, $project->name . '-academic.pdf');
    }

    protected function buildMarkdownExport(Project $project): string
    {
        $markdown = "# {$project->name}\n\n";
        $markdown .= "{$project->description}\n\n";
        $markdown .= "---\n\n";

        if ($project->prdDocument) {
            $markdown .= "## Product Requirements Document\n\n";
            $markdown .= $project->prdDocument->content . "\n\n";
            $markdown .= "---\n\n";
        }

        if ($project->designDocument) {
            $markdown .= "## Design Document\n\n";
            $markdown .= $project->designDocument->content . "\n\n";
            $markdown .= "---\n\n";
        }

        if ($project->techStackDocument) {
            $markdown .= "## Tech Stack Document\n\n";
            $markdown .= $project->techStackDocument->content . "\n\n";
        }

        return $markdown;
    }

    protected function buildCleanHTML(Project $project): string
    {
        $html = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{$project->name}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; border-bottom: 2px solid #95a5a6; padding-bottom: 5px; }
        h3 { color: #7f8c8d; margin-top: 20px; }
        pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
        hr { border: none; border-top: 2px solid #ecf0f1; margin: 40px 0; }
    </style>
</head>
<body>
HTML;

        $html .= "<h1>{$project->name}</h1>";
        $html .= "<p>{$project->description}</p>";
        $html .= "<hr>";

        if ($project->prdDocument) {
            $html .= "<h2>Product Requirements Document</h2>";
            $html .= $this->markdownToHTML($project->prdDocument->content);
            $html .= "<hr>";
        }

        if ($project->designDocument) {
            $html .= "<h2>Design Document</h2>";
            $html .= $this->markdownToHTML($project->designDocument->content);
            $html .= "<hr>";
        }

        if ($project->techStackDocument) {
            $html .= "<h2>Tech Stack Document</h2>";
            $html .= $this->markdownToHTML($project->techStackDocument->content);
        }

        $html .= "</body></html>";

        return $html;
    }

    protected function buildAcademicHTML(Project $project): string
    {
        $html = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{$project->name}</title>
    <style>
        @page { margin: 1in; }
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 2;
            color: #000;
            text-align: justify;
        }
        h1 {
            font-size: 16pt;
            font-weight: bold;
            text-align: center;
            margin-top: 0;
            margin-bottom: 24pt;
        }
        h2 {
            font-size: 14pt;
            font-weight: bold;
            margin-top: 24pt;
            margin-bottom: 12pt;
        }
        h3 {
            font-size: 12pt;
            font-weight: bold;
            margin-top: 18pt;
            margin-bottom: 6pt;
        }
        p {
            margin-bottom: 12pt;
            text-indent: 0.5in;
        }
        pre {
            font-family: 'Courier New', monospace;
            font-size: 10pt;
            background: #f9f9f9;
            border: 1px solid #ccc;
            padding: 10px;
            margin: 12pt 0;
        }
        .page-break { page-break-after: always; }
    </style>
</head>
<body>
HTML;

        $html .= "<h1>{$project->name}</h1>";
        $html .= "<p style='text-indent:0; text-align:center; font-style:italic;'>{$project->description}</p>";
        $html .= "<div class='page-break'></div>";

        if ($project->prdDocument) {
            $html .= "<h2>Product Requirements Document</h2>";
            $html .= $this->markdownToHTML($project->prdDocument->content);
            $html .= "<div class='page-break'></div>";
        }

        if ($project->designDocument) {
            $html .= "<h2>Design Document</h2>";
            $html .= $this->markdownToHTML($project->designDocument->content);
            $html .= "<div class='page-break'></div>";
        }

        if ($project->techStackDocument) {
            $html .= "<h2>Tech Stack Document</h2>";
            $html .= $this->markdownToHTML($project->techStackDocument->content);
        }

        $html .= "</body></html>";

        return $html;
    }

    protected function markdownToHTML(string $markdown): string
    {
        // Simple markdown conversion (you may want to use a library like Parsedown for better conversion)
        $html = $markdown;
        
        // Headers
        $html = preg_replace('/^### (.+)$/m', '<h3>$1</h3>', $html);
        $html = preg_replace('/^## (.+)$/m', '<h2>$1</h2>', $html);
        $html = preg_replace('/^# (.+)$/m', '<h1>$1</h1>', $html);
        
        // Bold and italic
        $html = preg_replace('/\*\*(.+?)\*\*/', '<strong>$1</strong>', $html);
        $html = preg_replace('/\*(.+?)\*/', '<em>$1</em>', $html);
        
        // Code blocks
        $html = preg_replace('/```(.+?)```/s', '<pre><code>$1</code></pre>', $html);
        $html = preg_replace('/`(.+?)`/', '<code>$1</code>', $html);
        
        // Lists
        $html = preg_replace('/^\- (.+)$/m', '<li>$1</li>', $html);
        $html = preg_replace('/(<li>.*<\/li>\n?)+/s', '<ul>$0</ul>', $html);
        
        // Paragraphs
        $html = preg_replace('/\n\n/', '</p><p>', $html);
        $html = '<p>' . $html . '</p>';
        
        return $html;
    }

    protected function generatePDF(string $html, string $filename)
    {
        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);
        
        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        
        return response($dompdf->output())
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }
}

