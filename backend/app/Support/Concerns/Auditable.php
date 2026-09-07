<?php

namespace App\Support\Concerns;

use App\Support\Models\AuditLog;

/**
 * Records create / update / delete on the model into `audit_logs` with a
 * before/after diff of the changed attributes.
 *
 * Opt out of noisy or sensitive columns with:
 *   protected array $auditExclude = ['remember_token'];
 * `password`, `remember_token`, and the timestamp columns are always excluded.
 */
trait Auditable
{
    public static function bootAuditable(): void
    {
        static::created(function ($model): void {
            $model->writeAudit('created', [], $model->auditableAttributes($model->getAttributes()));
        });

        static::updated(function ($model): void {
            $changed = $model->auditableAttributes($model->getChanges());

            if ($changed === []) {
                return;
            }

            $before = $model->auditableAttributes(
                array_intersect_key($model->getOriginal(), $changed),
            );

            $model->writeAudit('updated', $before, $changed);
        });

        static::deleted(function ($model): void {
            $forced = method_exists($model, 'isForceDeleting') && $model->isForceDeleting();
            $model->writeAudit($forced ? 'force_deleted' : 'deleted', [], []);
        });

        if (method_exists(static::class, 'restored')) {
            static::restored(function ($model): void {
                $model->writeAudit('restored', [], []);
            });
        }
    }

    /**
     * @param  array<string, mixed>  $old
     * @param  array<string, mixed>  $new
     */
    public function writeAudit(string $action, array $old, array $new): void
    {
        AuditLog::create([
            'user_id' => auth()->id(),
            'auditable_type' => $this->getMorphClass(),
            'auditable_id' => $this->getKey(),
            'action' => $action,
            'old_values' => $old ?: null,
            'new_values' => $new ?: null,
            'created_at' => now(),
        ]);
    }

    /**
     * @param  array<string, mixed>  $attributes
     * @return array<string, mixed>
     */
    protected function auditableAttributes(array $attributes): array
    {
        $always = ['password', 'remember_token', 'created_at', 'updated_at', 'deleted_at'];
        $custom = property_exists($this, 'auditExclude') ? $this->auditExclude : [];
        $excluded = array_merge($always, $custom);

        return array_diff_key($attributes, array_flip($excluded));
    }
}
