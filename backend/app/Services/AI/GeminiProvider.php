<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiProvider implements AIProviderInterface
{
    protected $apiKey;
    protected $model;

    // Try these models in order until one works
    protected array $modelFallbacks = [
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-pro',
        'gemini-1.5-pro-latest',
    ];

    public function __construct(string $apiKey, string $model = 'gemini-2.0-flash')
    {
        $this->apiKey = $apiKey;
        $this->model  = $model;
    }

    public function generate(string $prompt, array $options = []): array
    {
        $startTime = microtime(true);

        // Build the ordered list: preferred model first, then fallbacks
        $modelsToTry = array_unique(array_merge([$this->model], $this->modelFallbacks));

        foreach ($modelsToTry as $model) {
            try {
                $url = 'https://generativelanguage.googleapis.com/v1beta/models/' . $model . ':generateContent?key=' . $this->apiKey;

                $response = Http::withoutVerifying()
                    ->timeout($options['timeout'] ?? config('app.ai_timeout', 120))
                    ->post($url, [
                        'contents' => [
                            ['parts' => [['text' => $prompt]]]
                        ],
                    ]);

                $latency = (microtime(true) - $startTime) * 1000;

                if (!$response->successful()) {
                    $body = $response->json();
                    $errMsg = $body['error']['message'] ?? $response->body();

                    // If the model is not found, try the next one silently
                    if ($response->status() === 404 || str_contains($errMsg, 'not found')) {
                        Log::debug("Gemini model '{$model}' not found, trying next fallback.");
                        continue;
                    }

                    throw new \Exception('Gemini API request failed: ' . $response->body());
                }

                $data    = $response->json();
                $content = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

                Log::info("Gemini succeeded with model: {$model}");

                return [
                    'content'           => $content,
                    'prompt_tokens'     => 0,
                    'completion_tokens' => 0,
                    'total_tokens'      => 0,
                    'latency_ms'        => $latency,
                    'model'             => $model,
                ];
            } catch (\Exception $e) {
                // Only re-throw if it's not a "model not found" type error
                if (!str_contains($e->getMessage(), 'not found') && !str_contains($e->getMessage(), 'NOT_FOUND')) {
                    $latency = (microtime(true) - $startTime) * 1000;
                    return [
                        'error'      => $e->getMessage(),
                        'latency_ms' => $latency,
                    ];
                }
                Log::debug("Gemini model '{$model}' exception: " . $e->getMessage() . " — trying next.");
                continue;
            }
        }

        $latency = (microtime(true) - $startTime) * 1000;
        return [
            'error'      => 'All Gemini model variants failed. Please verify your API key is from Google AI Studio (https://aistudio.google.com).',
            'latency_ms' => $latency,
        ];
    }

    public function getProviderName(): string
    {
        return 'gemini';
    }

    public function getModel(): string
    {
        return $this->model;
    }

    public function canMakeRequest(): bool
    {
        return !empty($this->apiKey);
    }
}
