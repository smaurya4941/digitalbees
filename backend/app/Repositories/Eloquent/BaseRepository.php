<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

abstract class BaseRepository implements RepositoryInterface
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function all(array $columns = ['*']): Collection
    {
        return $this->model->all($columns);
    }

    public function paginate(int $perPage = 15, array $columns = ['*'])
    {
        return $this->model->paginate($perPage, $columns);
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(array $data, $id): bool
    {
        $record = $this->find($id);
        if (!$record) {
            return false;
        }
        return $record->update($data);
    }

    public function delete($id): bool
    {
        $record = $this->find($id);
        if (!$record) {
            return false;
        }
        return $record->delete();
    }

    public function find($id, array $columns = ['*']): ?Model
    {
        return $this->model->find($id, $columns);
    }

    public function findBy(string $field, $value, array $columns = ['*']): ?Model
    {
        return $this->model->where($field, $value)->first($columns);
    }
}
