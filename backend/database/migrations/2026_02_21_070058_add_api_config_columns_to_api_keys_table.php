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
        Schema::table('api_keys', function (Blueprint $table) {
            $table->boolean('is_backup')->default(false)->after('is_active');
            $table->timestamp('last_checked_at')->nullable()->after('avg_latency_ms');
            $table->enum('status', ['active', 'inactive', 'failed', 'rate_limited'])->default('inactive')->after('is_backup');
            // manual_priority logic: the table already has an integer 'priority' column which we will reuse as manual_priority implicitly
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('api_keys', function (Blueprint $table) {
            $table->dropColumn(['is_backup', 'last_checked_at', 'status']);
        });
    }
};
