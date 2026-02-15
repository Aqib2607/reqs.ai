<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SanitizeInput
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $input = $request->all();
        
        array_walk_recursive($input, function (&$value) {
            if (is_string($value)) {
                // Remove potential prompt injection patterns
                $value = $this->sanitizePromptInjection($value);
            }
        });
        
        $request->merge($input);
        
        return $next($request);
    }

    /**
     * Sanitize input to prevent prompt injection attacks.
     */
    protected function sanitizePromptInjection(string $input): string
    {
        // Remove common prompt injection patterns
        $patterns = [
            '/ignore (previous|above|all) (instructions?|prompts?|commands?)/i',
            '/system:\s*/i',
            '/assistant:\s*/i',
            '/\[INST\]/i',
            '/\[\/INST\]/i',
            '/<\|.*?\|>/i',
        ];
        
        foreach ($patterns as $pattern) {
            $input = preg_replace($pattern, '', $input);
        }
        
        return $input;
    }
}
