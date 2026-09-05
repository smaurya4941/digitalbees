<?php

namespace Database\Factories;

use App\Models\User;
use App\Support\Enums\UserStatus;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'status' => UserStatus::Active->value,
            'remember_token' => Str::random(10),
        ];
    }

    /** A suspended account (cannot authenticate). */
    public function suspended(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => UserStatus::Suspended->value,
        ]);
    }

    public function admin(): static
    {
        return $this->afterCreating(fn (User $user) => $user->syncRoles(['admin']));
    }

    public function staff(): static
    {
        return $this->afterCreating(fn (User $user) => $user->syncRoles(['staff']));
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
