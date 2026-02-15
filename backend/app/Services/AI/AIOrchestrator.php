<?php

namespace App\Services\AI;

use App\Models\ApiKey;
use App\Models\AiLog;
use Illuminate\Support\Facades\Log;

class AIOrchestrator
{
    protected $user;
    protected $project;

    public function __construct($user, $project = null)
    {
        $this->user = $user;
        $this->project = $project;
    }

    /**
     * Generate content using available AI providers with automatic fallback.
     */
    public function generate(string $prompt, array $options = []): array
    {
        $providers = $this->getOrderedProviders();

        if (empty($providers)) {
            throw new \Exception('No active AI providers available. Please configure API keys.');
        }

        $maxRetries = config('app.ai_max_retries', 3);
        $attempt = 0;

        foreach ($providers as $apiKey) {
            $attempt++;
            
            try {
                $provider = $this->createProvider($apiKey);
                
                if (!$provider->canMakeRequest()) {
                    continue;
                }

                Log::info("Attempting AI generation with {$apiKey->provider}", [
                    'attempt' => $attempt,
                    'provider' => $apiKey->provider,
                ]);

                $result = $provider->generate($prompt, $options);

                // Check if request was successful
                if (isset($result['error'])) {
                    $this->logFailure($apiKey, $result, $prompt);
                    
                    if ($attempt < count($providers)) {
                        Log::warning("Provider {$apiKey->provider} failed, trying next provider");
                        continue;
                    }
                    
                    throw new \Exception($result['error']);
                }

                // Success - log and update metrics
                $this->logSuccess($apiKey, $result, $prompt);
                $this->updateProviderMetrics($apiKey, $result['latency_ms']);

                return $result;

            } catch (\Exception $e) {
                Log::error("Provider {$apiKey->provider} error: " . $e->getMessage());
                
                if ($attempt >= count($providers)) {
                    throw $e;
                }
                
                continue;
            }
        }

        throw new \Exception('All AI providers failed to generate content.');
    }

    /**
     * Get API keys ordered by priority and latency.
     */
    protected function getOrderedProviders()
    {
        return $this->user->apiKeys()
            ->where('is_active', true)
            ->orderBy('priority', 'desc')
            ->orderBy('avg_latency_ms', 'asc')
            ->get();
    }

    /**
     * Create a provider instance based on API key configuration.
     */
    protected function createProvider(ApiKey $apiKey): AIProviderInterface
    {
        $decryptedKey = $apiKey->decrypted_key;

        return match($apiKey->provider) {
            'openai' => new OpenAIProvider($decryptedKey),
            'gemini' => new GeminiProvider($decryptedKey),
            'anthropic' => new AnthropicProvider($decryptedKey),
            'groq' => new GroqProvider($decryptedKey),
            'openrouter' => new OpenRouterProvider($decryptedKey),
            default => throw new \Exception("Unknown provider: {$apiKey->provider}"),
        };
    }

    /**
     * Log successful AI request.
     */
    protected function logSuccess(ApiKey $apiKey, array $result, string $prompt): void
    {
        AiLog::create([
            'api_key_id' => $apiKey->id,
            'project_id' => $this->project?->id,
            'provider' => $apiKey->provider,
            'model' => $result['model'] ?? 'unknown',
            'operation' => 'generate',
            'prompt_tokens' => $result['prompt_tokens'] ?? 0,
            'completion_tokens' => $result['completion_tokens'] ?? 0,
            'total_tokens' => $result['total_tokens'] ?? 0,
            'latency_ms' => $result['latency_ms'],
            'status' => 'success',
        ]);
    }

    /**
     * Log failed AI request.
     */
    protected function logFailure(ApiKey $apiKey, array $result, string $prompt): void
    {
        AiLog::create([
            'api_key_id' => $apiKey->id,
            'project_id' => $this->project?->id,
            'provider' => $apiKey->provider,
            'model' => $result['model'] ?? 'unknown',
            'operation' => 'generate',
            'latency_ms' => $result['latency_ms'],
            'status' => 'failure',
            'error_message' => $result['error'] ?? 'Unknown error',
        ]);
    }

    /**
     * Update provider performance metrics.
     */
    protected function updateProviderMetrics(ApiKey $apiKey, float $latency): void
    {
        $apiKey->increment('total_requests');
        $apiKey->increment('successful_requests');
        
        // Update average latency
        $totalSuccessful = $apiKey->successful_requests;
        $currentAvg = $apiKey->avg_latency_ms;
        $newAvg = (($currentAvg * ($totalSuccessful - 1)) + $latency) / $totalSuccessful;
        
        $apiKey->update([
            'avg_latency_ms' => round($newAvg, 2),
            'last_used_at' => now(),
        ]);
    }
}
