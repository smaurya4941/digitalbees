<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Page-resolution CMS — see docs/data-model/schema.sql (Module 3).
 * `pages` maps a URL path to a template + a primary (and optional secondary)
 * entity, which is how combinatorial routes (Practice x Industry, Region x
 * Practice) are produced without hardcoding views.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_templates', function (Blueprint $table): void {
            $table->id();
            $table->string('key_name', 100)->unique();
            $table->string('blade_view', 150); // retained name; value is now a frontend template key
            $table->string('description', 255)->nullable();
        });

        Schema::create('pages', function (Blueprint $table): void {
            $table->id();
            $table->string('url_path', 500)->unique();
            $table->foreignId('page_template_id')->constrained();
            $table->string('pageable_type', 100)->nullable();
            $table->unsignedBigInteger('pageable_id')->nullable();
            $table->string('secondary_type', 100)->nullable();
            $table->unsignedBigInteger('secondary_id')->nullable();
            $table->string('title', 255)->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->index(['pageable_type', 'pageable_id']);
            $table->index(['secondary_type', 'secondary_id']);
        });

        Schema::create('page_sections', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->string('section_key', 100);
            $table->json('content');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->timestamps();
        });

        Schema::create('navigation_menus', function (Blueprint $table): void {
            $table->id();
            $table->string('key_name', 50)->unique();
            $table->string('label', 100)->nullable();
        });

        Schema::create('navigation_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('navigation_menu_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('navigation_items')->cascadeOnDelete();
            $table->string('label', 150);
            $table->string('linkable_type', 100)->nullable();
            $table->unsignedBigInteger('linkable_id')->nullable();
            $table->string('custom_url', 255)->nullable();
            $table->string('icon', 100)->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
        });

        Schema::create('settings', function (Blueprint $table): void {
            $table->id();
            $table->string('key_name', 100)->unique();
            $table->text('value')->nullable();
            $table->string('type', 30)->default('string');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('navigation_items');
        Schema::dropIfExists('navigation_menus');
        Schema::dropIfExists('page_sections');
        Schema::dropIfExists('pages');
        Schema::dropIfExists('page_templates');
    }
};
