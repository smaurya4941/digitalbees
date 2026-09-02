<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Brings the framework `users` table up to docs/data-model/schema.sql (Module 1):
 * internal department, avatar reference and an active flag. `avatar_media_id` is
 * a loose reference into `media` (no foreign key) resolved by the application.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->enum('department', [
                'design', 'content_seo', 'cro', 'engineering', 'crm_ops', 'compliance',
            ])->nullable()->after('password');
            $table->unsignedBigInteger('avatar_media_id')->nullable()->after('department');
            $table->boolean('is_active')->default(true)->after('avatar_media_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['department', 'avatar_media_id', 'is_active']);
        });
    }
};
