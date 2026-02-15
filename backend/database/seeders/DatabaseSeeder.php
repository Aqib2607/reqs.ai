<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Project;
use App\Models\PrdDocument;
use App\Models\DesignDocument;
use App\Models\TechStackDocument;
use App\Models\ApiKey;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create 5 users
        $users = [];
        for ($i = 1; $i <= 5; $i++) {
            $users[] = User::create([
                'name' => "User {$i}",
                'email' => "user{$i}@example.com",
                'password' => Hash::make('password'),
                'company' => "Company {$i}",
                'role' => ['Developer', 'Manager', 'Designer', 'CTO', 'CEO'][$i - 1],
                'phone' => "+1 555-000-{$i}000",
                'plan' => ['free', 'pro', 'enterprise', 'free', 'pro'][$i - 1],
            ]);
        }

        // Create 5 projects for each user
        foreach ($users as $user) {
            for ($i = 1; $i <= 5; $i++) {
                $project = Project::create([
                    'user_id' => $user->id,
                    'name' => "Project {$i} - {$user->name}",
                    'description' => "Description for project {$i} by {$user->name}",
                    'status' => ['draft', 'in_progress', 'completed'][$i % 3],
                ]);

                // Create documents for completed projects
                if ($project->status === 'completed') {
                    PrdDocument::create([
                        'project_id' => $project->id,
                        'content' => "# PRD for {$project->name}\n\nThis is a sample PRD document.",
                        'version' => 1,
                        'is_approved' => $i % 2 === 0,
                    ]);

                    DesignDocument::create([
                        'project_id' => $project->id,
                        'content' => "# Design for {$project->name}\n\nThis is a sample design document.",
                        'version' => 1,
                        'is_approved' => $i % 2 === 0,
                    ]);

                    TechStackDocument::create([
                        'project_id' => $project->id,
                        'content' => "# Tech Stack for {$project->name}\n\nReact, Laravel, MySQL",
                        'version' => 1,
                        'is_approved' => $i % 2 === 0,
                    ]);
                }
            }

            // Create 5 API keys for each user
            $providers = ['openai', 'gemini', 'anthropic', 'groq', 'openrouter'];
            foreach ($providers as $index => $provider) {
                ApiKey::create([
                    'user_id' => $user->id,
                    'provider' => $provider,
                    'name' => ucfirst($provider) . ' Key',
                    'encrypted_key' => encrypt('sk-test-' . str_repeat('x', 40)),
                    'priority' => ($index + 1) * 10,
                    'is_active' => $index === 0,
                ]);
            }
        }
    }
}
