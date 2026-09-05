<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255); // Original file name
            $table->string('file_name', 255)->unique(); // Generated storage name
            $table->string('mime_type', 127);
            $table->unsignedBigInteger('size'); // In bytes
            $table->string('disk', 64)->default('public');
            $table->string('path', 512); // Path relative to disk root
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
