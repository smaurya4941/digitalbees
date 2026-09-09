<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// P2-3 — release content whose scheduled publish time has arrived.
Schedule::command('content:publish-scheduled')
    ->everyMinute()
    ->withoutOverlapping()
    ->runInBackground();
