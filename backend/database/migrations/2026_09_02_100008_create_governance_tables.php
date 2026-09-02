<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * CRM sync, consent, audit, content governance, KPIs and integrations —
 * see docs/data-model/schema.sql (Modules 4-5).
 *
 * Loose coupling: every reference (`lead_id`, `user_id`, `reviewer_id`, the
 * polymorphic `*_type`/`*_id` pairs) is a plain indexed column with no database
 * foreign key. These are append-mostly log/config tables owned by cross-cutting
 * services, so they must not block the migration or deletion of content rows.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crm_sync_logs', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('lead_id')->index();
            $table->integer('attempt_number')->default(1);
            $table->enum('status', ['success', 'failed']);
            $table->json('payload')->nullable();
            $table->json('response')->nullable();
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('consent_logs', function (Blueprint $table): void {
            $table->id();
            $table->string('session_id', 100)->index();
            $table->string('ip_address', 45)->nullable();
            $table->string('region_detected', 10)->nullable();
            $table->json('categories');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('audit_logs', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->string('auditable_type', 100);
            $table->unsignedBigInteger('auditable_id');
            $table->string('action', 50);
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->index(['auditable_type', 'auditable_id'], 'idx_auditable');
        });

        Schema::create('content_reviews', function (Blueprint $table): void {
            $table->id();
            $table->string('reviewable_type', 100);
            $table->unsignedBigInteger('reviewable_id');
            $table->unsignedBigInteger('reviewer_id')->index();
            $table->enum('cycle', ['weekly', 'monthly', 'quarterly', 'annual']);
            $table->text('notes')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->index(['reviewable_type', 'reviewable_id'], 'idx_reviewable');
        });

        Schema::create('kpi_snapshots', function (Blueprint $table): void {
            $table->id();
            $table->string('metric_key', 100);
            $table->decimal('value', 15, 4);
            $table->date('period_date');
            $table->timestamp('created_at')->nullable();
            $table->unique(['metric_key', 'period_date']);
        });

        Schema::create('integrations', function (Blueprint $table): void {
            $table->id();
            $table->string('key_name', 100)->unique();
            $table->json('config');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('integrations');
        Schema::dropIfExists('kpi_snapshots');
        Schema::dropIfExists('content_reviews');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('consent_logs');
        Schema::dropIfExists('crm_sync_logs');
    }
};
