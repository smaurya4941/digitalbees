<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('assets', function (Blueprint $table) {
            $table->string('alt_text', 500)->nullable()->after('name');
            $table->unsignedInteger('width')->nullable()->after('size');
            $table->unsignedInteger('height')->nullable()->after('width');
            // Loose reference — integrity is enforced in the service layer, like
            // the rest of the content graph. Nulled implicitly when unused.
            $table->unsignedBigInteger('uploaded_by')->nullable()->after('path');
            $table->index('uploaded_by');
        });
    }

    public function down(): void
    {
        Schema::table('assets', function (Blueprint $table) {
            $table->dropIndex(['uploaded_by']);
            $table->dropColumn(['alt_text', 'width', 'height', 'uploaded_by']);
        });
    }
};
