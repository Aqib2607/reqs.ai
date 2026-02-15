<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BackendSystemTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user registration and authentication.
     */
    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email'],
                'token',
            ]);
    }

    /**
     * Test user can login.
     */
    public function test_user_can_login(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'user',
                'token',
            ]);
    }

    /**
     * Test authenticated user can create a project.
     */
    public function test_authenticated_user_can_create_project(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withToken($token)->postJson('/api/projects', [
            'name' => 'Test Project',
            'description' => 'A test project description',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'name',
                'description',
                'status',
                'created_at',
                'updated_at',
            ]);
    }

    /**
     * Test authenticated user can list their projects.
     */
    public function test_authenticated_user_can_list_projects(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        // Create a project
        $user->projects()->create([
            'name' => 'Test Project',
            'description' => 'Test description',
            'status' => 'draft',
        ]);

        $response = $this->withToken($token)->getJson('/api/projects');

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    /**
     * Test unauthenticated user cannot access protected routes.
     */
    public function test_unauthenticated_user_cannot_access_protected_routes(): void
    {
        $response = $this->postJson('/api/projects', [
            'name' => 'Test Project',
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test API key can be created.
     */
    public function test_authenticated_user_can_create_api_key(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withToken($token)->postJson('/api/keys', [
            'provider' => 'openai',
            'key' => 'sk-test-key-12345',
            'name' => 'Test OpenAI Key',
            'priority' => 10,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'provider',
                'name',
                'priority',
                'is_active',
                'masked_key',
            ])
            ->assertJsonMissing(['encrypted_key']); // Should be hidden
    }

    /**
     * Test API key is encrypted in database.
     */
    public function test_api_key_is_encrypted_in_database(): void
    {
        $user = User::factory()->create();
        
        $plainKey = 'sk-test-key-12345';
        
        $apiKey = $user->apiKeys()->create([
            'provider' => 'openai',
            'encrypted_key' => $plainKey, // Will be encrypted by mutator
            'name' => 'Test Key',
            'priority' => 10,
            'is_active' => true,
        ]);

        // Refresh to get from database
        $apiKey->refresh();

        // Encrypted key should not match plain key
        $this->assertNotEquals($plainKey, $apiKey->getAttributes()['encrypted_key']);
        
        // But decrypted key should match
        $this->assertEquals($plainKey, $apiKey->decrypted_key);
    }

    /**
     * Test user can logout.
     */
    public function test_user_can_logout(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withToken($token)->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Logged out successfully',
            ]);
    }
}
