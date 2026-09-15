<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('case_studies', function (Blueprint $table): void {
            $table->json('how_it_works')->nullable()->after('solution');
            $table->json('capabilities_used')->nullable()->after('metrics');
        });
    }

    public function down(): void
    {
        Schema::table('case_studies', function (Blueprint $table): void {
            $table->dropColumn(['how_it_works', 'capabilities_used']);
        });
    }
};
