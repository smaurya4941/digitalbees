<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Order matters: roles/permissions and the admin account first, then
     * taxonomy, then the content graph that links it, then IA structure
     * (templates, navigation, settings).
     */
    public function run(): void
    {
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
