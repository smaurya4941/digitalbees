<?php

namespace Tests\Unit\Support;

use App\Support\Http\ApiResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Tests\TestCase;

class ApiResponseTest extends TestCase
{
    public function test_page_produces_the_standard_envelope(): void
    {
        $paginator = new LengthAwarePaginator(
            [['id' => 1], ['id' => 2]],
            total: 12,
            perPage: 2,
            currentPage: 2,
            options: ['path' => 'http://localhost/api/v1/admin/leads'],
        );

        $json = ApiResponse::page($paginator, null, ['statuses' => ['new', 'synced']])->getData(true);

        $this->assertSame([['id' => 1], ['id' => 2]], $json['data']);
        $this->assertSame(2, $json['meta']['current_page']);
        $this->assertSame(6, $json['meta']['last_page']);
        $this->assertSame(2, $json['meta']['per_page']);
        $this->assertSame(12, $json['meta']['total']);
        $this->assertSame(3, $json['meta']['from']);
        $this->assertSame(4, $json['meta']['to']);
        $this->assertSame(['new', 'synced'], $json['meta']['statuses']);
        $this->assertArrayHasKey('next', $json['links']);
        $this->assertArrayHasKey('prev', $json['links']);
    }

    public function test_page_maps_each_item_through_the_transform(): void
    {
        $paginator = new LengthAwarePaginator([1, 2, 3], total: 3, perPage: 15, currentPage: 1);

        $json = ApiResponse::page($paginator, fn (int $n) => ['n' => $n * 10])->getData(true);

        $this->assertSame([['n' => 10], ['n' => 20], ['n' => 30]], $json['data']);
    }
}
