<?php

namespace Tests\Feature\API;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Database\Seeders\SettingSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class SettingAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->seed([RoleSeeder::class, SettingSeeder::class]);
    }

    private function user(string $role): User
    {
        $user = User::factory()->create();
        $user->syncRoles([$role]);

        return $user;
    }

    public function test_settings_manage_gates_the_screen(): void
    {
        $this->actingAs($this->user('staff'))->getJson('/api/v1/admin/settings')->assertForbidden();

        $this->actingAs($this->user('admin'))->getJson('/api/v1/admin/settings')
            ->assertOk()
            ->assertJsonStructure(['data' => ['groups' => [['id', 'label', 'fields' => [['key', 'label', 'type', 'value']]]]]]);
    }

    public function test_admin_can_update_settings_and_the_public_endpoint_reflects_it(): void
    {
        $this->actingAs($this->user('admin'))->putJson('/api/v1/admin/settings', [
            'values' => ['site.name' => 'DigitalBees', 'feature.chatbot_enabled' => false],
        ])->assertOk();

        $this->assertDatabaseHas('settings', ['key_name' => 'site.name', 'value' => 'DigitalBees']);

        $public = $this->getJson('/api/v1/settings')->assertOk()->json('data');
        $this->assertSame('DigitalBees', $public['site.name']);
        $this->assertFalse($public['feature.chatbot_enabled']);
    }

    public function test_settings_are_validated_against_the_field_config(): void
    {
        $this->actingAs($this->user('admin'))->putJson('/api/v1/admin/settings', [
            'values' => ['contact.email' => 'not-an-email'],
        ])->assertStatus(422)->assertJsonValidationErrors('values');
    }

    public function test_public_settings_expose_only_whitelisted_keys(): void
    {
        $keys = array_keys($this->getJson('/api/v1/settings')->json('data'));

        $this->assertContains('site.name', $keys);
        $this->assertNotContains('seo.default_robots', $keys);
    }
}
