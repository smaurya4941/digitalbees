<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Normalizes `practices.key_capabilities`/`workflow_steps` (JSON columns)
 * into real tables — see docs/data-model/schema.sql (Module 2).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('capabilities', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('practice_id')->constrained()->cascadeOnDelete();
            $table->string('title', 150);
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('workflows', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('practice_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('step')->default(1);
            $table->string('title', 150);
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workflows');
        Schema::dropIfExists('capabilities');
    }
};
