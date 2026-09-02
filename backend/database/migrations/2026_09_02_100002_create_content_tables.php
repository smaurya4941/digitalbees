<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Trust + content + careers entities — see docs/data-model/schema.sql (Module 2).
 * `resources` covers blog/guide/webinar/research/news; "insights" is the public
 * label for resource_type=blog and is filtered at the query layer.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('case_studies', function (Blueprint $table): void {
            $table->id();
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->string('client_name', 150)->nullable();
            $table->unsignedBigInteger('client_logo_media_id')->nullable();
            $table->text('summary')->nullable();
            $table->text('challenge')->nullable();
            $table->text('solution')->nullable();
            $table->text('results')->nullable();
            $table->json('metrics')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['status', 'published_at']);
        });

        Schema::create('resources', function (Blueprint $table): void {
            $table->id();
            $table->enum('resource_type', ['blog', 'guide', 'webinar', 'research', 'news']);
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->text('excerpt')->nullable();
            $table->longText('body')->nullable();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->integer('reading_time_minutes')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['resource_type', 'status', 'published_at']);
        });

        Schema::create('resource_categories', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
        });

        Schema::create('resource_category_resource', function (Blueprint $table): void {
            $table->foreignId('resource_category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('resource_id')->constrained()->cascadeOnDelete();
            $table->primary(['resource_category_id', 'resource_id']);
        });

        Schema::create('locations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('region_id')->constrained();
            $table->string('name', 150)->nullable();
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('country', 100)->nullable();
            $table->decimal('lat', 10, 7)->nullable();
            $table->decimal('lng', 10, 7)->nullable();
            $table->enum('status', ['draft', 'published'])->default('published');
            $table->timestamps();
        });

        Schema::create('job_postings', function (Blueprint $table): void {
            $table->id();
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->foreignId('location_id')->nullable()->constrained('locations')->nullOnDelete();
            $table->enum('employment_type', ['full_time', 'part_time', 'contract'])->default('full_time');
            $table->longText('description')->nullable();
            $table->string('ats_external_id', 100)->nullable();
            $table->enum('status', ['draft', 'open', 'closed'])->default('draft');
            $table->timestamp('posted_at')->nullable();
            $table->timestamp('closes_at')->nullable();
            $table->timestamps();
            $table->index(['status', 'posted_at']);
        });

        Schema::create('job_applications', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('job_id')->constrained('job_postings');
            $table->string('full_name', 150);
            $table->string('email', 150);
            $table->string('phone', 50)->nullable();
            $table->unsignedBigInteger('resume_media_id')->nullable();
            $table->text('cover_note')->nullable();
            $table->enum('status', ['submitted', 'reviewed', 'shortlisted', 'rejected', 'hired'])->default('submitted');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_applications');
        Schema::dropIfExists('job_postings');
        Schema::dropIfExists('locations');
        Schema::dropIfExists('resource_category_resource');
        Schema::dropIfExists('resource_categories');
        Schema::dropIfExists('resources');
        Schema::dropIfExists('case_studies');
    }
};
