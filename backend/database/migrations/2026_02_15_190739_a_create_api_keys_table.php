<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('api_keys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('provider');
            $table->text('encrypted_key');
            $table->string('name')->nullable();
            $table->integer('priority')->default(0);
            $table->boolean('is_active')->default(true);
            $table->integer('total_requests')->default(0);
            $table->integer('successful_requests')->default(0);
            $table->decimal('avg_latency_ms', 10, 2)->default(0);
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('api_keys');
    }
};
