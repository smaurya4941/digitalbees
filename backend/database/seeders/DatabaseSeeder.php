<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Order matters: taxonomy first, then the content graph that links it,
     * then IA structure (templates, navigation, settings).
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')],
        );

        $this->call([
            RoleSeeder::class,
            PracticeSeeder::class,
            IndustrySeeder::class,
            RegionSeeder::class,
            TechnologySeeder::class,
            LocationSeeder::class,
            CaseStudySeeder::class,
            EntityRelationSeeder::class,
            PageTemplateSeeder::class,
            NavigationSeeder::class,
            SettingSeeder::class,
        ]);
    }
}
