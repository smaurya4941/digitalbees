<?php

namespace Tests\Feature\API;

use App\Models\User;
use App\Modules\Practice\Models\Practice;
use App\Support\Models\AuditLog;
use Database\Seeders\IndustrySeeder;
use Database\Seeders\PracticeSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class AuditLogTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->seed([RoleSeeder::class, PracticeSeeder::class, IndustrySeeder::class]);
    }

    private function user(string $role): User
    {
        $user = User::factory()->create();
        $user->syncRoles([$role]);

        return $user;
    }

    public function test_updating_content_records_a_diff_with_the_acting_user(): void
    {
        $staff = $this->user('staff');

        $this->actingAs($staff)->putJson('/api/v1/practices/ai-bees', ['tagline' => 'New tagline.'])
            ->assertOk();

        $log = AuditLog::query()
            ->where('auditable_type', 'practice')
            ->where('action', 'updated')
            ->latest('id')
            ->first();

        $this->assertNotNull($log);
        $this->assertSame($staff->id, $log->user_id);
        $this->assertSame('New tagline.', $log->new_values['tagline']);
        $this->assertArrayHasKey('tagline', $log->old_values);
    }

    public function test_deleting_content_is_recorded(): void
    {
        $this->actingAs($this->user('admin'))->deleteJson('/api/v1/practices/energy-bees')->assertOk();

        $practice = Practice::withTrashed()->where('slug', 'energy-bees')->firstOrFail();

        $this->assertDatabaseHas('audit_logs', [
            'auditable_type' => 'practice',
            'auditable_id' => $practice->id,
            'action' => 'deleted',
        ]);
    }

    public function test_audit_log_endpoint_requires_the_audit_view_permission(): void
    {
        $this->actingAs($this->user('staff'))->getJson('/api/v1/admin/audit-logs')->assertForbidden();

        $this->actingAs($this->user('admin'))->getJson('/api/v1/admin/audit-logs')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [['id', 'action', 'auditable_type', 'user', 'created_at']],
                'meta' => ['current_page', 'last_page', 'total', 'actions'],
            ]);
    }

    public function test_audit_log_can_be_filtered_by_entity(): void
    {
        $this->actingAs($this->user('admin'))
            ->getJson('/api/v1/admin/audit-logs?auditable_type=practice&action=created')
            ->assertOk()
            ->assertJsonPath('data.0.auditable_type', 'practice')
            ->assertJsonPath('data.0.action', 'created');
    }
}
