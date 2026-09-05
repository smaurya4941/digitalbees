<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Auth hardening for the Sanctum SPA + spatie/laravel-permission setup:
 *
 * - `users.status` — account lifecycle (active / invited / suspended). Replaces
 *   the earlier boolean `is_active`.
 * - `roles.description` / `permissions.description` — human copy for the
 *   back-office roles & permissions screens.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('status', 20)->default('active')->after('email');
        });

        DB::table('users')->where('is_active', false)->update(['status' => 'suspended']);

        Schema::table('users', function (Blueprint $table): void {
            if (Schema::hasColumn('users', 'is_active')) {
                $table->dropColumn('is_active');
            }
        });

        Schema::table('roles', function (Blueprint $table): void {
            $table->string('description', 255)->nullable()->after('guard_name');
        });

        Schema::table('permissions', function (Blueprint $table): void {
            $table->string('description', 255)->nullable()->after('guard_name');
            $table->string('group', 50)->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->boolean('is_active')->default(true)->after('email');
            $table->dropColumn('status');
        });

        Schema::table('roles', function (Blueprint $table): void {
            $table->dropColumn('description');
        });

        Schema::table('permissions', function (Blueprint $table): void {
            $table->dropColumn(['description', 'group']);
        });
    }
};
