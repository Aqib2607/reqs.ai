<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Http;

class AnthropicProvider implements AIProviderInterface
{
    protected $apiKey;
    protected $model;

    public function __construct(string $apiKey, string $model = 'claude-3-sonnet-20240229')
    {
        $this->apiKey = $apiKey;
        $this->model = $model;
    }

    public function generate(string $prompt, array $options = []): array
    {
        $startTime = microtime(true);

        try {
            $response = Http::withHeaders([
                'x-api-key' => $this->apiKey,
                'anthropic-version' => '2023-06-01',
                'Content-Type' => 'application/json',
            ])
            ->timeout($options['timeout'] ?? config('app.ai_timeout', 120))
            ->post('https://api.anthropic.com/v1/messages', [
                'model' => $options['model'] ?? $this->model,
                'max_tokens' => $options['max_tokens'] ?? 4000,
                'messages' => [
                    ['role' => 'user', 'content' => $prompt]
                ],
            ]);

            $latency = (microtime(true) - $startTime) * 1000;

            if (!$response->successful()) {
                throw new \Exception('Anthropic API request failed: ' . $response->body());
            }

            $data = $response->json();

            return [
                'content' => $data['content'][0]['text'] ?? '',
                'prompt_tokens' => $data['usage']['input_tokens'] ?? 0,
                'completion_tokens' => $data['usage']['output_tokens'] ?? 0,
                'total_tokens' => ($data['usage']['input_tokens'] ?? 0) + ($data['usage']['output_tokens'] ?? 0),
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
        return 'anthropic';
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
