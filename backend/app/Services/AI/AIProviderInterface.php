<?php

namespace App\Services\AI;

interface AIProviderInterface
{
    /**
     * Generate content using the AI provider.
     *
     * @param string $prompt
     * @param array $options
     * @return array
     */
    public function generate(string $prompt, array $options = []): array;

    /**
     * Get the provider name.
     *
     * @return string
     */
    public function getProviderName(): string;

    /**
     * Get the model being used.
     *
     * @return string
     */
    public function getModel(): string;

    /**
     * Validate if the provider can make requests.
     *
     * @return bool
     */
    public function canMakeRequest(): bool;
}
