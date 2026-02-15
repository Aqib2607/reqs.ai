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
        Schema::table('users', function (Blueprint $table) {
            $table->string('company')->nullable()->after('email');
            $table->string('role')->nullable()->after('company');
            $table->string('phone')->nullable()->after('role');
            $table->enum('plan', ['free', 'pro', 'enterprise'])->default('free')->after('phone');
            $table->boolean('email_notifications')->default(true)->after('plan');
            $table->boolean('two_factor_enabled')->default(false)->after('email_notifications');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['company', 'role', 'phone', 'plan', 'email_notifications', 'two_factor_enabled']);
        });
    }
};
