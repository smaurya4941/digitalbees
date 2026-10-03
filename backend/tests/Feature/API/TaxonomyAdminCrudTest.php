<?php

namespace Tests\Feature\API;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * End-to-end admin lifecycle for the slug-keyed content types that had no
 * admin test: draft is hidden → publish shows it → edits reach the public
 * API → delete removes it. Mirrors what an editor does in the admin panel.
 */
class TaxonomyAdminCrudTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->seed([RoleSeeder::class]);
    }

    private function user(string $role): User
    {
        $user = User::factory()->create();
        $user->syncRoles([$role]);

        return $user;
    }

    /** @return array<string, array{string, string}> resource path, title field */
    public static function types(): array
    {
        return [
            'industries' => ['industries', 'name'],
            'regions' => ['regions', 'name'],
            'technologies' => ['technologies', 'name'],
            'case-studies' => ['case-studies', 'title'],
        ];
    }

    #[DataProvider('types')]
    public function test_writes_require_authentication(string $path, string $field): void
    {
        $this->postJson("/api/v1/{$path}", [$field => 'X', 'slug' => 'x'])->assertUnauthorized();
        $this->getJson("/api/v1/admin/{$path}")->assertUnauthorized();
    }

    #[DataProvider('types')]
    public function test_admin_full_lifecycle_is_reflected_publicly(string $path, string $field): void
    {
        $admin = $this->user('admin');
        $slug = 'crud-audit-'.$path;

        $this->actingAs($admin)->postJson("/api/v1/{$path}", [
            $field => 'Audit Item',
            'slug' => $slug,
            'status' => 'draft',
        ])->assertCreated();

        // Draft: visible in admin, invisible to the public.
        $this->actingAs($admin)->getJson("/api/v1/admin/{$path}/{$slug}")->assertOk();
        $this->app['auth']->forgetGuards();
        $this->getJson("/api/v1/{$path}/{$slug}")->assertNotFound();

        $this->actingAs($admin)->putJson("/api/v1/{$path}/{$slug}", [
            $field => 'Audit Item Renamed',
            'status' => 'published',
        ])->assertOk();

        $this->app['auth']->forgetGuards();
        $this->getJson("/api/v1/{$path}/{$slug}")
            ->assertOk()
            ->assertJsonFragment([$field => 'Audit Item Renamed']);
        $this->getJson("/api/v1/{$path}")->assertOk()->assertJsonFragment(['slug' => $slug]);

        $this->actingAs($admin)->deleteJson("/api/v1/{$path}/{$slug}")->assertOk();

        $this->app['auth']->forgetGuards();
        $this->getJson("/api/v1/{$path}/{$slug}")->assertNotFound();
    }

    /** The exact payload shape the admin CaseStudyForm submits. */
    public function test_case_study_admin_form_payload_saves_every_field(): void
    {
        $this->seed([\Database\Seeders\PracticeSeeder::class]);
        $admin = $this->user('admin');
        $practice = \App\Modules\Practice\Models\Practice::query()->where('slug', 'ai-bees')->firstOrFail();

        $this->actingAs($admin)->postJson('/api/v1/case-studies', [
            'title' => 'Form Payload Study',
            'slug' => 'form-payload-study',
            'status' => 'published',
            'client_name' => 'Acme Bank',
            'summary' => 'Summary.',
            'challenge' => 'Challenge.',
            'solution' => 'Solution.',
            'results' => 'Results.',
            'metrics' => [['value' => '40%', 'label' => 'Faster']],
            'how_it_works' => [['title' => 'Assess', 'description' => 'Audit.']],
            'capabilities_used' => ['Implementation'],
            'practice_ids' => [$practice->id],
        ])->assertCreated()
            ->assertJsonPath('data.results', 'Results.')
            ->assertJsonPath('data.practice_ids', [$practice->id]);

        $this->app['auth']->forgetGuards();
        $this->getJson('/api/v1/case-studies/form-payload-study')
            ->assertOk()
            ->assertJsonPath('data.results', 'Results.')
            ->assertJsonPath('data.metrics.0.value', '40%')
            ->assertJsonPath('data.how_it_works.0.step', 1)
            ->assertJsonPath('data.practices.0.slug', 'ai-bees');

        // Unlinking on update removes the edge.
        $this->actingAs($admin)->putJson('/api/v1/case-studies/form-payload-study', [
            'practice_ids' => [],
        ])->assertOk();
        $this->app['auth']->forgetGuards();
        $this->getJson('/api/v1/case-studies/form-payload-study')->assertJsonCount(0, 'data.practices');
    }

    #[DataProvider('types')]
    public function test_staff_cannot_delete(string $path, string $field): void
    {
        $admin = $this->user('admin');
        $slug = 'crud-guard-'.$path;

        $this->actingAs($admin)->postJson("/api/v1/{$path}", [
            $field => 'Guarded', 'slug' => $slug,
        ])->assertCreated();

        $this->actingAs($this->user('staff'))
            ->deleteJson("/api/v1/{$path}/{$slug}")
            ->assertForbidden();
    }
}
