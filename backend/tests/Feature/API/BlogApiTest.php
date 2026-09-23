<?php

namespace Tests\Feature\API;

use App\Jobs\NotifyFrontendRevalidate;
use App\Models\User;
use App\Modules\Resource\Models\BlogCategory;
use App\Modules\Resource\Models\Resource;
use Database\Seeders\BlogSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class BlogApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->seed(RoleSeeder::class);
    }

    private function user(string $role): User
    {
        $user = User::factory()->create();
        $user->syncRoles([$role]);

        return $user;
    }

    private function category(string $slug = 'engineering', string $name = 'Engineering'): BlogCategory
    {
        return BlogCategory::create(['name' => $name, 'slug' => $slug]);
    }

    private function makePost(array $overrides = []): Resource
    {
        return Resource::create(array_merge([
            'title' => 'A post',
            'slug' => 'a-post',
            'resource_type' => 'blog',
            'excerpt' => 'Excerpt.',
            'status' => 'published',
            'published_at' => now()->subHour(),
        ], $overrides));
    }

    // --- Categories --------------------------------------------------------

    public function test_admin_manages_categories_and_slug_is_derived(): void
    {
        $admin = $this->user('admin');

        $id = $this->actingAs($admin)->postJson('/api/v1/blog-categories', ['name' => 'Cloud & DevOps'])
            ->assertCreated()
            ->assertJsonPath('data.slug', 'cloud-devops')
            ->json('data.id');

        // Renaming keeps the slug (stable URLs) unless one is sent explicitly.
        $this->actingAs($admin)->putJson("/api/v1/blog-categories/{$id}", ['name' => 'Cloud'])
            ->assertOk()
            ->assertJsonPath('data.name', 'Cloud')
            ->assertJsonPath('data.slug', 'cloud-devops');

        $this->actingAs($admin)->getJson('/api/v1/admin/blog-categories')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Cloud');

        Queue::assertPushed(NotifyFrontendRevalidate::class, fn ($job) => in_array('insights', $job->tags, true));
    }

    public function test_category_writes_require_permission_and_unique_slug(): void
    {
        $this->postJson('/api/v1/blog-categories', ['name' => 'X'])->assertUnauthorized();

        $this->category('engineering');
        $this->actingAs($this->user('admin'))
            ->postJson('/api/v1/blog-categories', ['name' => 'Engineering'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('slug');
    }

    public function test_deleting_a_category_uncategorises_its_posts(): void
    {
        $category = $this->category();
        $post = $this->makePost(['blog_category_id' => $category->id]);

        $this->actingAs($this->user('admin'))
            ->deleteJson("/api/v1/blog-categories/{$category->id}")
            ->assertOk();

        $this->assertNull($post->fresh()->blog_category_id);
    }

    // --- Admin posts -------------------------------------------------------

    public function test_staff_creates_a_full_post_with_normalised_tags_and_auto_reading_time(): void
    {
        $category = $this->category();
        $body = str_repeat('word ', 700);

        $this->actingAs($this->user('staff'))->postJson('/api/v1/resources', [
            'title' => 'Scaling pods',
            'resource_type' => 'blog',
            'blog_category_id' => $category->id,
            'body' => $body,
            'cover_image' => 'https://images.example.com/cover.jpg',
            'cover_image_alt' => 'A team',
            'author_name' => 'Jamie Rivera',
            'author_role' => 'Delivery Lead',
            'tags' => [' AI ', 'ai', 'Hiring', ''],
            'is_featured' => true,
        ])
            ->assertCreated()
            ->assertJsonPath('data.slug', 'scaling-pods')
            ->assertJsonPath('data.category.slug', 'engineering')
            ->assertJsonPath('data.tags', ['AI', 'Hiring'])
            ->assertJsonPath('data.is_featured', true)
            ->assertJsonPath('data.reading_time_minutes', 4)
            ->assertJsonPath('data.public_url', '/blog/scaling-pods');
    }

    public function test_post_validation_rejects_unsafe_urls_and_unknown_categories(): void
    {
        $this->actingAs($this->user('staff'))->postJson('/api/v1/resources', [
            'title' => 'Bad',
            'resource_type' => 'blog',
            'cover_image' => 'javascript:alert(1)',
            'blog_category_id' => 999,
        ])->assertStatus(422)->assertJsonValidationErrors(['cover_image', 'blog_category_id']);
    }

    public function test_renaming_a_post_slug_leaves_a_blog_redirect(): void
    {
        $this->makePost(['slug' => 'old-slug']);

        $this->actingAs($this->user('admin'))
            ->putJson('/api/v1/resources/old-slug', ['slug' => 'new-slug'])
            ->assertOk();

        $this->assertDatabaseHas('redirects', ['from_path' => '/blog/old-slug', 'to_path' => '/blog/new-slug']);
    }

    public function test_preview_renders_markdown_through_the_sanitiser(): void
    {
        $this->postJson('/api/v1/admin/blog/preview', ['body' => 'x'])->assertUnauthorized();

        $this->actingAs($this->user('staff'))
            ->postJson('/api/v1/admin/blog/preview', [
                'body' => "## Hello\n\n<img src=x onerror=alert(1)> [x](javascript:alert(1)) <script>bad()</script>",
            ])
            ->assertOk()
            ->assertJsonPath('data.toc.0.id', 'hello')
            ->assertJsonPath('data.html', fn (string $html) => ! str_contains($html, 'onerror')
                && ! str_contains($html, 'javascript:')
                && ! str_contains($html, '<script'));
    }

    // --- Public API --------------------------------------------------------

    public function test_public_feed_filters_by_category_tag_and_search_and_hides_drafts_and_scheduled(): void
    {
        $eng = $this->category('engineering');
        $ai = $this->category('ai', 'AI');

        $this->makePost(['slug' => 'eng-post', 'title' => 'Kubernetes at scale', 'blog_category_id' => $eng->id, 'tags' => ['Cloud']]);
        $this->makePost(['slug' => 'ai-post', 'title' => 'Agents in banking', 'blog_category_id' => $ai->id, 'tags' => ['AI']]);
        $this->makePost(['slug' => 'draft', 'status' => 'draft', 'published_at' => null]);
        $this->makePost(['slug' => 'scheduled', 'published_at' => now()->addDay()]);
        $this->makePost(['slug' => 'a-guide', 'resource_type' => 'guide']);

        $slugs = fn (string $query) => array_column($this->getJson("/api/v1/blog/posts{$query}")->assertOk()->json('data'), 'slug');

        $this->assertEqualsCanonicalizing(['eng-post', 'ai-post'], $slugs(''));
        $this->assertSame(['eng-post'], $slugs('?category=engineering'));
        $this->assertSame(['ai-post'], $slugs('?tag=AI'));
        $this->assertSame(['eng-post'], $slugs('?q=kubernetes'));
        $this->assertSame([], $slugs('?q=%25'));

        $this->getJson('/api/v1/blog/posts')->assertJsonPath('data.0.href', fn ($href) => str_starts_with($href, '/blog/'));
    }

    public function test_public_detail_returns_safe_body_toc_and_related_posts(): void
    {
        $eng = $this->category();
        $this->makePost([
            'slug' => 'main',
            'blog_category_id' => $eng->id,
            'body' => "## First\n\nText <a href=\"javascript:x()\">bad</a>\n\n## Second",
        ]);
        $this->makePost(['slug' => 'sibling', 'blog_category_id' => $eng->id]);
        $this->makePost(['slug' => 'other']);

        $response = $this->getJson('/api/v1/blog/posts/main')
            ->assertOk()
            ->assertJsonPath('data.category.slug', 'engineering')
            ->assertJsonPath('data.toc.1.text', 'Second')
            ->assertJsonPath('data.related.0.slug', 'sibling');

        $this->assertStringNotContainsString('javascript:', $response->json('data.body'));
        $this->assertCount(2, $response->json('data.related'));

        $this->getJson('/api/v1/blog/posts/does-not-exist')->assertNotFound();
    }

    public function test_uncategorised_post_falls_back_to_latest_posts_as_related(): void
    {
        $this->makePost(['slug' => 'loner', 'body' => '<h2>Legacy HTML body</h2><p onclick="x()">Hi</p>']);
        $this->makePost(['slug' => 'newer', 'published_at' => now()->subMinute()]);

        $response = $this->getJson('/api/v1/blog/posts/loner')
            ->assertOk()
            ->assertJsonPath('data.related.0.slug', 'newer')
            ->assertJsonPath('data.toc.0.text', 'Legacy HTML body');

        $this->assertStringNotContainsString('onclick', $response->json('data.body'));
    }

    public function test_public_categories_include_published_post_counts(): void
    {
        $eng = $this->category();
        $this->makePost(['slug' => 'one', 'blog_category_id' => $eng->id]);
        $this->makePost(['slug' => 'two', 'blog_category_id' => $eng->id, 'status' => 'draft']);

        $this->getJson('/api/v1/blog/categories')
            ->assertOk()
            ->assertJsonPath('data.0.slug', 'engineering')
            ->assertJsonPath('data.0.post_count', 1)
            ->assertJsonPath('data.0.href', '/blog/category/engineering');
    }

    public function test_blog_seeder_creates_one_reference_post_idempotently(): void
    {
        $this->seed(BlogSeeder::class);
        $this->seed(BlogSeeder::class);

        $this->assertSame(1, Resource::query()->blog()->count());
        $this->getJson('/api/v1/blog/posts/from-ai-pilot-to-production-four-guardrails')
            ->assertOk()
            ->assertJsonPath('data.is_featured', true)
            ->assertJsonPath('data.author.name', 'TeamBees Editorial');
    }
}
