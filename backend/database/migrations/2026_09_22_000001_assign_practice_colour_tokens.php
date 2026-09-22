<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * The seven practices were seeded with only two colour tokens (brand-gold /
 * brand-navy), so the nav, homepage and about page couldn't tell them apart.
 * Give each its own practice-* token (styles/tokens/colors.css) — but only
 * where the row still holds its original seeded value, so a colour an editor
 * already picked in the admin is never overwritten.
 */
return new class extends Migration
{
    /** slug => [seeded token, new token] */
    private const MAP = [
        'talent-bees' => ['brand-gold', 'practice-talent'],
        'digital-bees' => ['brand-navy', 'practice-digital'],
        'ai-bees' => ['brand-gold', 'practice-ai'],
        'marketing-bees' => ['brand-navy', 'practice-marketing'],
        'quality-bees' => ['brand-navy', 'practice-quality'],
        'servicenow-bees' => ['brand-gold', 'practice-servicenow'],
        'energy-bees' => ['brand-gold', 'practice-energy'],
    ];

    public function up(): void
    {
        foreach (self::MAP as $slug => [$seeded, $token]) {
            DB::table('practices')
                ->where('slug', $slug)
                ->where(fn ($q) => $q->where('color_token', $seeded)->orWhereNull('color_token'))
                ->update(['color_token' => $token]);
        }
    }

    public function down(): void
    {
        foreach (self::MAP as $slug => [$seeded, $token]) {
            DB::table('practices')
                ->where('slug', $slug)
                ->where('color_token', $token)
                ->update(['color_token' => $seeded]);
        }
    }
};
