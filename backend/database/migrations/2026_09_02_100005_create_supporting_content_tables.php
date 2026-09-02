<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Supporting content — see docs/data-model/schema.sql (Module 6).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table): void {
            $table->id();
            $table->text('quote');
            $table->string('author_name', 150)->nullable();
            $table->string('author_title', 150)->nullable();
            $table->string('author_company', 150)->nullable();
            $table->unsignedBigInteger('author_photo_media_id')->nullable();
            $table->string('related_type', 100)->nullable();
            $table->unsignedBigInteger('related_id')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('faqs', function (Blueprint $table): void {
            $table->id();
            $table->string('faqable_type', 100)->nullable();
            $table->unsignedBigInteger('faqable_id')->nullable();
            $table->string('question', 500);
            $table->text('answer');
            $table->integer('sort_order')->default(0);
            $table->enum('status', ['draft', 'published'])->default('draft');
        });

        Schema::create('team_members', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 150);
            $table->string('title', 150)->nullable();
            $table->text('bio')->nullable();
            $table->unsignedBigInteger('photo_media_id')->nullable();
            $table->string('linkedin_url', 255)->nullable();
            $table->boolean('is_leadership')->default(false);
            $table->integer('sort_order')->default(0);
            $table->enum('status', ['draft', 'published'])->default('draft');
        });

        Schema::create('partners', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 150);
            $table->unsignedBigInteger('logo_media_id')->nullable();
            $table->enum('partner_type', ['technology', 'alliance', 'certification'])->default('technology');
            $table->foreignId('technology_id')->nullable()->constrained('technologies')->nullOnDelete();
            $table->string('url', 255)->nullable();
            $table->integer('sort_order')->default(0);
            $table->enum('status', ['draft', 'published'])->default('draft');
        });

        Schema::create('company_milestones', function (Blueprint $table): void {
            $table->id();
            $table->smallInteger('year');
            $table->string('title', 255)->nullable();
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_milestones');
        Schema::dropIfExists('partners');
        Schema::dropIfExists('team_members');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('testimonials');
    }
};
