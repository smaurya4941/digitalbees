<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Taxonomy backbone — see docs/data-model/schema.sql (Module 2).
 * These are the entities the Next.js dynamic routes resolve against.
 *
 * Loose coupling: cross-table references are plain indexed `*_id` columns, not
 * database foreign keys. Referential integrity and cascade behaviour live in the
 * application layer (module Services / Observers), so tables can be migrated,
 * seeded, cached and evolved independently per module.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('practices', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->string('tagline', 255)->nullable();
            $table->text('summary')->nullable();
            $table->string('icon', 100)->nullable();
            $table->string('color_token', 50)->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
            $table->index(['status', 'sort_order']);
        });

        Schema::create('sub_services', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('practice_id')->index();
            $table->string('name', 150);
            $table->string('slug', 150);
            $table->text('summary')->nullable();
            $table->longText('body')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['practice_id', 'slug']);
        });

        Schema::create('industries', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->text('summary')->nullable();
            $table->string('icon', 100)->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('regions', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->string('iso_code', 10)->nullable();
            $table->text('summary')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('technologies', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->text('summary')->nullable();
            $table->unsignedBigInteger('logo_media_id')->nullable();
            $table->string('vendor_name', 100)->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('technologies');
        Schema::dropIfExists('regions');
        Schema::dropIfExists('industries');
        Schema::dropIfExists('sub_services');
        Schema::dropIfExists('practices');
    }
};
