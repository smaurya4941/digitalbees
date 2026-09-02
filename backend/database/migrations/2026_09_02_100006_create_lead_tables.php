<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Forms / leads / chatbot / search-log — see docs/data-model/schema.sql (Module 4-5).
 * CRM sync logs, consent logs, audit logs, content reviews, KPI snapshots and
 * integrations live in 2026_09_02_100008_create_governance_tables.
 *
 * Loose coupling: references are plain indexed `*_id` columns, no DB foreign keys.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('source_page_id')->nullable()->index();
            $table->string('full_name', 150)->nullable();
            $table->string('email', 150)->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('company', 150)->nullable();
            $table->text('message')->nullable();
            $table->enum('form_type', ['contact', 'demo_request', 'newsletter', 'chatbot']);
            $table->json('utm')->nullable();
            $table->integer('score')->default(0);
            $table->enum('status', ['new', 'synced', 'failed', 'duplicate'])->default('new');
            $table->string('crm_reference_id', 100)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
            $table->index(['status', 'created_at']);
        });

        Schema::create('newsletter_subscribers', function (Blueprint $table): void {
            $table->id();
            $table->string('email', 150)->unique();
            $table->enum('status', ['subscribed', 'unsubscribed'])->default('subscribed');
            $table->unsignedBigInteger('source_page_id')->nullable()->index();
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('chatbot_conversations', function (Blueprint $table): void {
            $table->id();
            $table->string('session_id', 100);
            $table->unsignedBigInteger('lead_id')->nullable()->index();
            $table->json('transcript');
            $table->boolean('resolved')->default(false);
            $table->timestamps();
            $table->index('session_id');
        });

        Schema::create('search_queries', function (Blueprint $table): void {
            $table->id();
            $table->string('query', 255);
            $table->integer('results_count')->default(0);
            $table->string('user_ip', 45)->nullable();
            $table->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('search_queries');
        Schema::dropIfExists('chatbot_conversations');
        Schema::dropIfExists('newsletter_subscribers');
        Schema::dropIfExists('leads');
    }
};
