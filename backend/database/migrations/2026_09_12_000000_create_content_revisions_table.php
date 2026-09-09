<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Per-entity version history for content / taxonomy rows (P2-1).
 *
 * Each row is a complete, restorable JSON snapshot of one content entity at a
 * point in time — its own columns plus its SEO block (key `_seo`) and, later,
 * its content-graph edges (key `_relations`). Append-only; pruned to
 * `config('revisions.keep')` per entity.
 *
 * Loose coupling: `revisionable_type` stores the morph-map key and `author_id`
 * is a plain indexed column with no database foreign key, so deleting a user or
 * a content row never blocks on this log table.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_revisions', function (Blueprint $table): void {
            $table->id();
            $table->string('revisionable_type', 100);
            $table->unsignedBigInteger('revisionable_id');
            $table->unsignedBigInteger('author_id')->nullable()->index();
            $table->json('data');
            $table->string('summary', 255)->nullable();
            $table->timestamp('created_at')->nullable();
            $table->index(['revisionable_type', 'revisionable_id'], 'idx_revisionable');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_revisions');
    }
};
