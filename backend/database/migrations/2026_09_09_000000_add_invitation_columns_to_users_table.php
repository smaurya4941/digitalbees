<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Invite flow + last-seen for the users admin screen.
 *
 * - `invitation_token` / `invitation_sent_at` — an opaque, single-use token
 *   emailed to a new account; exchanged for a password on the accept page.
 * - `last_login_at` — stamped by AuthController on a successful login.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('invitation_token', 64)->nullable()->unique()->after('status');
            $table->timestamp('invitation_sent_at')->nullable()->after('invitation_token');
            $table->timestamp('last_login_at')->nullable()->after('invitation_sent_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['invitation_token', 'invitation_sent_at', 'last_login_at']);
        });
    }
};
