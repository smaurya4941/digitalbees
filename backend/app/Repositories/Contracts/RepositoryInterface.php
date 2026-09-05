<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

interface RepositoryInterface
{
    public function all(array $columns = ['*']): Collection;
    
    public function paginate(int $perPage = 15, array $columns = ['*']);

    public function create(array $data): Model;

    public function update(array $data, $id): bool;

    public function delete($id): bool;

    public function find($id, array $columns = ['*']): ?Model;
    
    public function findBy(string $field, $value, array $columns = ['*']): ?Model;
}
