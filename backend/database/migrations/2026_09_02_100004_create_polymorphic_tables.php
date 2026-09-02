<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Universal polymorphic tables — see docs/data-model/schema.sql (Module 7).
 * `seo_metadata` is the single source the frontend's generateMetadata() reads;
 * `redirects` feeds the Next.js middleware.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entity_relations', function (Blueprint $table): void {
            $table->id();
            $table->string('subject_type', 100);
            $table->unsignedBigInteger('subject_id');
            $table->string('related_type', 100);
            $table->unsignedBigInteger('related_id');
            $table->string('relation_type', 50)->default('related');
            $table->integer('sort_order')->default(0);
            $table->timestamp('created_at')->nullable();
            $table->unique(['subject_type', 'subject_id', 'related_type', 'related_id', 'relation_type'], 'uniq_relation');
            $table->index(['related_type', 'related_id']);
        });

        Schema::create('seo_metadata', function (Blueprint $table): void {
            $table->id();
            $table->string('seoable_type', 100);
            $table->unsignedBigInteger('seoable_id');
            $table->string('meta_title', 255)->nullable();
            $table->string('meta_description', 500)->nullable();
            $table->string('canonical_url', 255)->nullable();
            $table->string('robots', 50)->default('index,follow');
            $table->string('og_title', 255)->nullable();
            $table->string('og_description', 500)->nullable();
            $table->unsignedBigInteger('og_image_id')->nullable();
            $table->string('twitter_card', 50)->nullable();
            $table->string('schema_type', 50)->nullable();
            $table->json('schema_json')->nullable();
            $table->timestamps();
            $table->unique(['seoable_type', 'seoable_id'], 'uniq_seoable');
        });

        Schema::create('media', function (Blueprint $table): void {
            $table->id();
            $table->string('mediable_type', 100);
            $table->unsignedBigInteger('mediable_id');
            $table->string('collection', 50)->default('default');
            $table->string('disk', 50)->default('s3');
            $table->string('path', 255);
            $table->string('alt_text', 255)->nullable();
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->integer('file_size_kb')->nullable();
            $table->json('formats')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamp('created_at')->nullable();
            $table->index(['mediable_type', 'mediable_id']);
        });

        Schema::create('redirects', function (Blueprint $table): void {
            $table->id();
            $table->string('from_path', 500)->unique();
            $table->string('to_path', 500);
            $table->smallInteger('status_code')->default(301);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('redirects');
        Schema::dropIfExists('media');
        Schema::dropIfExists('seo_metadata');
        Schema::dropIfExists('entity_relations');
    }
};
