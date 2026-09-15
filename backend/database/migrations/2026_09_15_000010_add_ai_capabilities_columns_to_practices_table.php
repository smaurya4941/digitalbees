<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('practices', function (Blueprint $table): void {
            $table->json('key_stats')->nullable()->after('featured_image');
            $table->json('key_capabilities')->nullable()->after('key_stats');
            $table->json('workflow_steps')->nullable()->after('key_capabilities');
            $table->json('framework_stack')->nullable()->after('workflow_steps');
            $table->json('agent_capabilities')->nullable()->after('framework_stack');
            $table->json('technical_capabilities')->nullable()->after('agent_capabilities');
            $table->json('servicenow_fit')->nullable()->after('technical_capabilities');
        });
    }

    public function down(): void
    {
        Schema::table('practices', function (Blueprint $table): void {
            $table->dropColumn([
                'key_stats',
                'key_capabilities',
                'workflow_steps',
                'framework_stack',
                'agent_capabilities',
                'technical_capabilities',
                'servicenow_fit',
            ]);
        });
    }
};
