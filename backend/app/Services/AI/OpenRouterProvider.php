<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Http;

class OpenRouterProvider implements AIProviderInterface
{
    protected $apiKey;
    protected $model;

    public function __construct(string $apiKey, string $model = 'openai/gpt-4')
    {
        $this->apiKey = $apiKey;
        $this->model = $model;
    }

    public function generate(string $prompt, array $options = []): array
    {
        $startTime = microtime(true);

        try {
            $response = Http::withoutVerifying()->withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])
                ->timeout($options['timeout'] ?? config('app.ai_timeout', 120))
                ->post('https://openrouter.ai/api/v1/chat/completions', [
                    'model' => $options['model'] ?? $this->model,
                    'messages' => [
                        ['role' => 'user', 'content' => $prompt]
                    ],
                ]);

            $latency = (microtime(true) - $startTime) * 1000;

            if (!$response->successful()) {
                throw new \Exception('OpenRouter API request failed: ' . $response->body());
            }

            $data = $response->json();

            return [
                'content' => $data['choices'][0]['message']['content'] ?? '',
                'prompt_tokens' => $data['usage']['prompt_tokens'] ?? 0,
                'completion_tokens' => $data['usage']['completion_tokens'] ?? 0,
                'total_tokens' => $data['usage']['total_tokens'] ?? 0,
                'latency_ms' => $latency,
                'model' => $data['model'] ?? $this->model,
            ];
        } catch (\Exception $e) {
            $latency = (microtime(true) - $startTime) * 1000;

            return [
                'error' => $e->getMessage(),
                'latency_ms' => $latency,
            ];
        }
    }

    public function getProviderName(): string
    {
        return 'openrouter';
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
