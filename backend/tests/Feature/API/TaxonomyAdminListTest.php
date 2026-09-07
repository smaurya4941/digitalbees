<?php

namespace Tests\Feature\API;

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * The shared paginate / search / status-filter behaviour of every taxonomy
 * admin list endpoint (P0-4). Per-type CRUD authorization is proven by
 * {@see PracticeAdminTest} + the shared GuardsPublishing trait.
 */
class TaxonomyAdminListTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->seed(DatabaseSeeder::class);
    }

    private function admin(): User
    {
        $user = User::factory()->create();
        $user->syncRoles(['admin']);

        return $user;
    }

    /** @return array<string, array{0: string}> */
    public static function endpoints(): array
    {
        return [
            'practices' => ['practices'],
            'industries' => ['industries'],
            'regions' => ['regions'],
            'technologies' => ['technologies'],
            'case-studies' => ['case-studies'],
        ];
    }

    #[DataProvider('endpoints')]
    public function test_list_endpoint_returns_the_standard_page_envelope(string $type): void
    {
        $this->getJson("/api/v1/admin/{$type}")->assertUnauthorized();

        $this->actingAs($this->admin())->getJson("/api/v1/admin/{$type}")
            ->assertOk()
            ->assertJsonStructure([
                'data',
                'meta' => ['current_page', 'last_page', 'per_page', 'total', 'statuses'],
                'links' => ['prev', 'next'],
            ]);
    }

    #[DataProvider('endpoints')]
    public function test_list_endpoint_honours_status_filter_and_pagination(string $type): void
    {
        $admin = $this->admin();

        $all = $this->actingAs($admin)->getJson("/api/v1/admin/{$type}?per_page=2")->assertOk();
        $this->assertSame(2, $all->json('meta.per_page'));
        $this->assertLessThanOrEqual(2, count($all->json('data')));

        $published = $this->actingAs($admin)->getJson("/api/v1/admin/{$type}?status=published")->assertOk();
        foreach ($published->json('data') as $row) {
            $this->assertSame('published', $row['status']);
        }
    }

    public function test_free_text_search_matches_the_slug(): void
    {
        $this->actingAs($this->admin())->getJson('/api/v1/admin/practices?q=energy-bees')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.slug', 'energy-bees');
    }
}
