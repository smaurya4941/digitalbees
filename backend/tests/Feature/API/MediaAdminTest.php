<?php

namespace Tests\Feature\API;

use App\Models\User;
use App\Modules\Media\Models\Media;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake(config('media.disk'));
        $this->seed(RoleSeeder::class);
    }

    private function user(string $role): User
    {
        $user = User::factory()->create();
        $user->syncRoles([$role]);

        return $user;
    }

    public function test_staff_can_upload_an_image_and_dimensions_are_captured(): void
    {
        // A real 1x1 PNG — getimagesize() reads the header without the GD
        // extension (which the fake-image factory would require).
        $png = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        );
        $tmp = tempnam(sys_get_temp_dir(), 'px').'.png';
        file_put_contents($tmp, $png);
        $file = new UploadedFile($tmp, 'hero.png', 'image/png', null, true);

        $response = $this->actingAs($this->user('staff'))
            ->postJson('/api/v1/admin/media', ['file' => $file]);

        $response->assertCreated()
            ->assertJsonPath('data.width', 1)
            ->assertJsonPath('data.height', 1)
            ->assertJsonPath('data.mime_type', 'image/png');

        $media = Media::query()->firstOrFail();
        $this->assertNotNull($media->uploaded_by);
        $this->assertStringStartsWith('media/', $media->path);
        Storage::disk(config('media.disk'))->assertExists($media->path);
    }

    public function test_svg_uploads_are_rejected(): void
    {
        $this->actingAs($this->user('staff'))->postJson('/api/v1/admin/media', [
            'file' => UploadedFile::fake()->create('logo.svg', 4, 'image/svg+xml'),
        ])->assertStatus(422)->assertJsonValidationErrors('file');
    }

    public function test_staff_can_edit_metadata_but_cannot_delete(): void
    {
        $media = Media::create([
            'name' => 'old.jpg',
            'file_name' => 'x.jpg',
            'mime_type' => 'image/jpeg',
            'size' => 10,
            'disk' => config('media.disk'),
            'path' => 'media/x.jpg',
        ]);

        $this->actingAs($this->user('staff'))
            ->patchJson("/api/v1/admin/media/{$media->id}", ['alt_text' => 'A hero image'])
            ->assertOk()
            ->assertJsonPath('data.alt_text', 'A hero image');

        $this->actingAs($this->user('staff'))
            ->deleteJson("/api/v1/admin/media/{$media->id}")
            ->assertForbidden();

        $this->actingAs($this->user('admin'))
            ->deleteJson("/api/v1/admin/media/{$media->id}")
            ->assertOk();

        $this->assertDatabaseMissing('assets', ['id' => $media->id]);
    }

    public function test_index_uses_the_standard_page_envelope(): void
    {
        $this->actingAs($this->user('staff'))->getJson('/api/v1/admin/media')
            ->assertOk()
            ->assertJsonStructure([
                'data',
                'meta' => ['current_page', 'last_page', 'per_page', 'total'],
                'links' => ['prev', 'next'],
            ]);
    }
}
