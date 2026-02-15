<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Http;

class GeminiProvider implements AIProviderInterface
{
    protected $apiKey;
    protected $model;

    public function __construct(string $apiKey, string $model = 'gemini-pro')
    {
        $this->apiKey = $apiKey;
        $this->model = $model;
    }

    public function generate(string $prompt, array $options = []): array
    {
        $startTime = microtime(true);

        try {
            $response = Http::timeout($options['timeout'] ?? config('app.ai_timeout', 120))
                ->post('https://generativelanguage.googleapis.com/v1/models/' . $this->model . ':generateContent?key=' . $this->apiKey, [
                    'contents' => [
                        ['parts' => [['text' => $prompt]]]
                    ],
                ]);

            $latency = (microtime(true) - $startTime) * 1000;

            if (!$response->successful()) {
                throw new \Exception('Gemini API request failed: ' . $response->body());
            }

            $data = $response->json();
            $content = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

            return [
                'content' => $content,
                'prompt_tokens' => 0, // Gemini doesn't return token counts in the same way
                'completion_tokens' => 0,
                'total_tokens' => 0,
                'latency_ms' => $latency,
                'model' => $this->model,
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
