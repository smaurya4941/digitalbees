<?php

namespace Tests\Feature\API;

use App\Models\User;
use App\Modules\Faq\Models\Faq;
use App\Modules\Practice\Models\Practice;
use Database\Seeders\PracticeSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class FaqAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->seed([RoleSeeder::class, PracticeSeeder::class]);
    }

    private function user(string $role): User
    {
        $user = User::factory()->create();
        $user->syncRoles([$role]);

        return $user;
    }

    public function test_writes_require_authentication(): void
    {
        $this->postJson('/api/v1/faqs', ['question' => 'X?', 'answer' => 'Y.'])->assertUnauthorized();
        $this->getJson('/api/v1/admin/faqs')->assertUnauthorized();
    }

    public function test_staff_can_create_update_and_attach_a_faq_to_a_practice(): void
    {
        $staff = $this->user('staff');
        $practice = Practice::query()->where('slug', 'ai-bees')->firstOrFail();

        $created = $this->actingAs($staff)->postJson('/api/v1/faqs', [
            'question' => 'Do you build production AI agents?',
            'answer' => 'Yes — architecture, orchestration, evaluation, and guardrails.',
            'faqable_type' => 'practice',
            'faqable_id' => $practice->id,
        ]);

        $created->assertCreated()
            ->assertJsonPath('data.status', 'draft')
            ->assertJsonPath('data.faqable_type', 'practice');

        $id = $created->json('data.id');

        $this->actingAs($staff)->putJson("/api/v1/faqs/{$id}", [
            'answer' => 'Updated answer.',
        ])->assertOk()->assertJsonPath('data.answer', 'Updated answer.');

        $this->actingAs($this->user('admin'))->putJson("/api/v1/faqs/{$id}", [
            'status' => 'published',
        ])->assertOk()->assertJsonPath('data.status', 'published');

        $this->getJson("/api/v1/practices/ai-bees")
            ->assertOk()
            ->assertJsonFragment(['answer' => 'Updated answer.']);
    }

    public function test_staff_cannot_delete_but_admin_can(): void
    {
        $faq = Faq::create([
            'question' => 'Q?',
            'answer' => 'A.',
            'status' => 'published',
        ]);

        $this->actingAs($this->user('staff'))
            ->deleteJson("/api/v1/faqs/{$faq->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('faqs', ['id' => $faq->id]);

        $this->actingAs($this->user('admin'))
            ->deleteJson("/api/v1/faqs/{$faq->id}")
            ->assertOk();

        $this->assertDatabaseMissing('faqs', ['id' => $faq->id]);
    }

    public function test_admin_index_paginates_filters_and_searches(): void
    {
        Faq::create(['question' => 'Alpha question?', 'answer' => 'Alpha answer.', 'status' => 'published']);
        Faq::create(['question' => 'Beta question?', 'answer' => 'Beta answer.', 'status' => 'draft']);

        $this->actingAs($this->user('admin'))
            ->getJson('/api/v1/admin/faqs')
            ->assertOk()
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('meta.statuses', ['draft', 'published'])
            ->assertJsonStructure(['data', 'meta' => ['current_page', 'last_page', 'per_page', 'total'], 'links']);

        $this->actingAs($this->user('admin'))
            ->getJson('/api/v1/admin/faqs?q=Alpha')
            ->assertOk()
            ->assertJsonPath('meta.total', 1);
    }
}
