<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Identity & access — see docs/data-model/schema.sql (Module 1).
 *
 * Spatie-compatible column layout (roles / permissions / pivot tables) so the
 * laravel-permission package can be adopted later without a reshape. Kept
 * loosely coupled: the pivots carry plain indexed id columns and a polymorphic
 * (model_type, model_id) pair — no database foreign keys — so identity can be
 * managed independently of the CMS content tables.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 100);
            $table->string('guard_name', 50)->default('web');
            $table->timestamps();
            $table->unique(['name', 'guard_name']);
        });

        Schema::create('permissions', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 100);
            $table->string('guard_name', 50)->default('web');
            $table->timestamps();
            $table->unique(['name', 'guard_name']);
        });

        Schema::create('model_has_roles', function (Blueprint $table): void {
            $table->unsignedBigInteger('role_id');
            $table->string('model_type', 100);
            $table->unsignedBigInteger('model_id');
            $table->primary(['role_id', 'model_id', 'model_type'], 'model_has_roles_primary');
            $table->index(['model_type', 'model_id']);
        });

        Schema::create('model_has_permissions', function (Blueprint $table): void {
            $table->unsignedBigInteger('permission_id');
            $table->string('model_type', 100);
            $table->unsignedBigInteger('model_id');
            $table->primary(['permission_id', 'model_id', 'model_type'], 'model_has_permissions_primary');
            $table->index(['model_type', 'model_id']);
        });

        Schema::create('role_has_permissions', function (Blueprint $table): void {
            $table->unsignedBigInteger('permission_id');
            $table->unsignedBigInteger('role_id');
            $table->primary(['permission_id', 'role_id']);
            $table->index('role_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('role_has_permissions');
        Schema::dropIfExists('model_has_permissions');
        Schema::dropIfExists('model_has_roles');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }
};
