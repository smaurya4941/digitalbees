<?php

namespace Tests\Feature\API;

use App\Models\User;
use App\Modules\Region\Models\Location;
use App\Modules\Region\Models\Region;
use Database\Seeders\RegionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class LocationAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->seed([RoleSeeder::class, RegionSeeder::class]);
    }

    private function user(string $role): User
    {
        $user = User::factory()->create();
        $user->syncRoles([$role]);

        return $user;
    }

    private function region(): Region
    {
        return Region::query()->where('slug', 'uk')->firstOrFail();
    }

    public function test_writes_require_authentication(): void
    {
        $this->postJson('/api/v1/locations', ['name' => 'X'])->assertUnauthorized();
        $this->getJson('/api/v1/admin/locations')->assertUnauthorized();
    }

    public function test_staff_can_create_update_and_publish_an_office(): void
    {
        $staff = $this->user('staff');

        $created = $this->actingAs($staff)->postJson('/api/v1/locations', [
            'region_id' => $this->region()->id,
            'name' => 'TeamBees Manchester',
            'city' => 'Manchester',
            'country' => 'United Kingdom',
        ]);

        $created->assertCreated()
            ->assertJsonPath('data.slug', 'manchester')
            ->assertJsonPath('data.status', 'draft');

        $this->actingAs($staff)->putJson('/api/v1/locations/manchester', ['status' => 'published'])
            ->assertOk()
            ->assertJsonPath('data.status', 'published');
    }

    public function test_admin_index_lists_regions_and_filters_by_region(): void
    {
        $uk = $this->region();
        $usa = Region::query()->where('slug', 'usa')->firstOrFail();

        Location::create(['region_id' => $uk->id, 'name' => 'A', 'slug' => 'a', 'status' => 'published']);
        Location::create(['region_id' => $usa->id, 'name' => 'B', 'slug' => 'b', 'status' => 'published']);

        $this->actingAs($this->user('admin'))->getJson("/api/v1/admin/locations?region={$uk->id}")
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.slug', 'a')
            ->assertJsonStructure(['meta' => ['regions', 'statuses']]);
    }

    public function test_public_feed_shows_only_published_offices(): void
    {
        $uk = $this->region();
        Location::create(['region_id' => $uk->id, 'name' => 'Live', 'slug' => 'live', 'status' => 'published']);
        Location::create(['region_id' => $uk->id, 'name' => 'Hidden', 'slug' => 'hidden', 'status' => 'draft']);

        $slugs = array_column($this->getJson('/api/v1/locations')->assertOk()->json('data'), 'slug');
        $this->assertContains('live', $slugs);
        $this->assertNotContains('hidden', $slugs);

        $this->getJson('/api/v1/locations/hidden')->assertNotFound();
        $this->getJson('/api/v1/locations/live')->assertOk()->assertJsonPath('data.name', 'Live');
    }
}
