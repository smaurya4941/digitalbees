<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Turns `resources` (resource_type = blog) into a full blog: admin-managed
 * categories plus the presentation fields a real post needs (cover image,
 * author byline, tags, featured flag).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_categories', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 120)->unique();
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::table('resources', function (Blueprint $table): void {
            $table->foreignId('blog_category_id')->nullable()->after('resource_type')
                ->constrained('blog_categories')->nullOnDelete();
            $table->string('cover_image', 500)->nullable()->after('body');
            $table->string('cover_image_alt', 255)->nullable()->after('cover_image');
            $table->string('author_name', 150)->nullable()->after('author_id');
            $table->string('author_role', 150)->nullable()->after('author_name');
            $table->string('author_avatar', 500)->nullable()->after('author_role');
            $table->json('tags')->nullable()->after('author_avatar');
            $table->boolean('is_featured')->default(false)->after('tags');
            $table->index(['resource_type', 'is_featured']);
        });
    }

    public function down(): void
    {
        Schema::table('resources', function (Blueprint $table): void {
            $table->dropIndex(['resource_type', 'is_featured']);
            $table->dropConstrainedForeignId('blog_category_id');
            $table->dropColumn([
                'cover_image', 'cover_image_alt', 'author_name', 'author_role',
                'author_avatar', 'tags', 'is_featured',
            ]);
        });

        Schema::dropIfExists('blog_categories');
    }
};
