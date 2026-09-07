<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

/**
 * Locations get a public `slug` (the route key, per the information
 * architecture). Existing rows are backfilled from the city / name.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('locations', function (Blueprint $table): void {
            $table->string('slug', 255)->nullable()->unique()->after('name');
        });

        foreach (DB::table('locations')->whereNull('slug')->get() as $row) {
            $base = Str::slug($row->city ?: $row->name ?: "location-{$row->id}");
            $slug = $base;
            $n = 2;

            while (DB::table('locations')->where('slug', $slug)->exists()) {
                $slug = "{$base}-{$n}";
                $n++;
            }

            DB::table('locations')->where('id', $row->id)->update(['slug' => $slug]);
        }
    }

    public function down(): void
    {
        Schema::table('locations', function (Blueprint $table): void {
            $table->dropColumn('slug');
        });
    }
};
