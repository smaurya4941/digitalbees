<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('region_practice_pages', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('region_id')->constrained('regions')->cascadeOnDelete();
            $table->foreignId('practice_id')->constrained('practices')->cascadeOnDelete();
            $table->string('custom_headline', 255)->nullable();
            $table->text('custom_intro')->nullable();
            $table->boolean('is_published')->default(false);
            $table->string('meta_title', 255)->nullable();
            $table->string('meta_description', 500)->nullable();
            $table->string('og_image', 255)->nullable();
            $table->string('canonical_url', 500)->nullable();
            $table->string('schema_type', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['region_id', 'practice_id']);
            $table->index('is_published');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('region_practice_pages');
    }
};
