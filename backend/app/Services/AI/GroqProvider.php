<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Http;

class GroqProvider implements AIProviderInterface
{
    protected $apiKey;
    protected $model;

    protected array $modelFallbacks = [
        'llama-3.3-70b-versatile',
        'llama-3.1-8b-instant',
        'llama3-8b-8192',
        'mixtral-8x7b-32768',
    ];

    public function __construct(string $apiKey, string $model = 'llama-3.3-70b-versatile')
    {
        $this->apiKey = $apiKey;
        $this->model  = $model;
    }

    public function generate(string $prompt, array $options = []): array
    {
        $startTime = microtime(true);

        $modelsToTry = array_unique(array_merge([$this->model], $this->modelFallbacks));

        foreach ($modelsToTry as $model) {
            try {
                $response = Http::withoutVerifying()->withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type'  => 'application/json',
                ])
                    ->timeout($options['timeout'] ?? config('app.ai_timeout', 120))
                    ->post('https://api.groq.com/openai/v1/chat/completions', [
                        'model'       => $model,
                        'messages'    => [
                            ['role' => 'user', 'content' => $prompt]
                        ],
                        'temperature' => $options['temperature'] ?? 0.7,
                    ]);

                $latency = (microtime(true) - $startTime) * 1000;

                if (!$response->successful()) {
                    $body   = $response->json();
                    $errMsg = $body['error']['message'] ?? $response->body();

                    // Model decommissioned or not found — try next
                    if (str_contains($errMsg, 'decommissioned') || str_contains($errMsg, 'not found') || $response->status() === 404) {
                        continue;
                    }

                    throw new \Exception('Groq API request failed: ' . $response->body());
                }

                $data = $response->json();

                return [
                    'content'           => $data['choices'][0]['message']['content'] ?? '',
                    'prompt_tokens'     => $data['usage']['prompt_tokens'] ?? 0,
                    'completion_tokens' => $data['usage']['completion_tokens'] ?? 0,
                    'total_tokens'      => $data['usage']['total_tokens'] ?? 0,
                    'latency_ms'        => $latency,
                    'model'             => $data['model'] ?? $model,
                ];
            } catch (\Exception $e) {
                if (str_contains($e->getMessage(), 'decommissioned') || str_contains($e->getMessage(), 'not found')) {
                    continue;
                }
                $latency = (microtime(true) - $startTime) * 1000;
                return ['error' => $e->getMessage(), 'latency_ms' => $latency];
            }
        }

        $latency = (microtime(true) - $startTime) * 1000;
        return ['error' => 'All Groq model variants failed or are decommissioned.', 'latency_ms' => $latency];
    }

    public function getProviderName(): string
    {
        return 'groq';
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
